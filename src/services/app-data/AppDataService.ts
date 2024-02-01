import type {
  AppArtifact,
  AppCharacter,
  AppMonster,
  AppWeapon,
  ArtifactType,
  Party,
  PartyData,
  Target,
  WeaponType,
} from "@Src/types";
import { BACKEND_URL, GENSHIN_DEV_URL } from "@Src/constants";
import { findByCode, pickProps, toArray } from "@Src/utils";
import { CharacterSubscriber, DataControl, Metadata, Response, Update } from "./types";
 
export class AppDataService {
  private isFetchedMetadata = false;

  private characters: Array<DataControl<AppCharacter>> = [];
  private characterSubscribers: Map<string, Set<CharacterSubscriber>> = new Map();

  private weapons: Array<DataControl<AppWeapon>> = [];
  private artifacts: Array<DataControl<AppArtifact>> = [];
  private monsters: AppMonster[] = [];
  public updates: Update[] = [];
  public supporters: string[] = [];

  constructor() {
    // this.characters = characters.map((character) => ({
    //   status: "fetched",
    //   data: character,
    // }));
  }

  private getCharacterControl(name: string) {
    return this.characters.find((character) => character.data.name === name);
  }

  private getItemControl(type: "weapons", code: number): DataControl<AppWeapon> | undefined;
  private getItemControl(type: "artifacts", code: number): DataControl<AppArtifact> | undefined;
  private getItemControl(type: "weapons" | "artifacts", code: number) {
    return type === "weapons"
      ? this.weapons.find((weapon) => weapon.data.code === code)
      : this.artifacts.find((artifact) => artifact.data.code === code);
  }

  private async fetchData<T>(url: string): Response<T> {
    return await fetch(url)
      .then((res) => res.json())
      .catch((err) => ({
        code: 500,
        message: err.message,
        data: null,
      }));
  }

  public async fetchMetadata() {
    if (this.isFetchedMetadata) {
      return true;
    }
    const response = await this.fetchData<Metadata>(BACKEND_URL.metadata());

    if (response.data) {
      this.isFetchedMetadata = true;

      // response.data.characters.forEach((dataCharacter) => {
      //   const control = this.getCharacterControl(dataCharacter.name);

      //   if (control) {
      //     Object.assign(control.data, dataCharacter);
      //   }
      // });

      this.characters = response.data.characters.map((dataCharacter) => ({
        status: "fetched",
        data: dataCharacter,
      }));

      this.weapons = response.data.weapons.map((dataWeapon) => ({
        status: "fetched",
        data: dataWeapon,
      }));

      this.artifacts = response.data.artifacts.map((dataArtifact) => ({
        status: "fetched",
        data: dataArtifact,
      }));

      this.monsters = response.data.monsters;
      this.updates = response.data.updates;
      this.supporters = response.data.supporters;

      return true;
    }

    return false;
  }

  // ========== CHARACTERS ==========

  public subscribeCharacter(name: string, subscriber: CharacterSubscriber) {
    const existSubscribers = this.characterSubscribers.get(name);

    if (existSubscribers) {
      existSubscribers.add(subscriber);
    } else {
      this.characterSubscribers.set(name, new Set([subscriber]));
    }

    return () => this.unsubscribeCharacter(name, subscriber);
  }

  public unsubscribeCharacter(name: string, subscriber: CharacterSubscriber) {
    this.characterSubscribers.get(name)?.delete(subscriber);
  }

  async fetchCharacter(name: string): Response<AppCharacter> {
    const control = this.getCharacterControl(name);

    if (!control) {
      return {
        code: 404,
        message: "Character not found",
        data: null,
      };
    }

    if (control.status === "fetched") {
      return {
        code: 200,
        data: control.data,
      };
    }

    control.status = "fetching";
    const response = await this.fetchData<AppCharacter>(BACKEND_URL.character.byName(name));

    if (response.data) {
      control.status = "fetched";
      Object.assign(control.data, response.data);

      const characterSubscribers = this.characterSubscribers.get(name);

      if (characterSubscribers) {
        characterSubscribers.forEach((subscriber) => {
          subscriber(control.data);
        });
      }

      return {
        ...response,
        data: control.data,
      };
    }

    return response;
  }

  async fetchConsDescriptions(name: string): Response<string[]> {
    const { constellation = [] } = this.getCharacterControl(name)?.data || {};

    if (constellation[0]) {
      if (constellation[0].description) {
        return {
          code: 200,
          data: constellation.map((cons) => cons.description || "[Description missing]"),
        };
      }

      const response = await fetch(GENSHIN_DEV_URL.character(name))
        .then((res) => res.json())
        .catch((err) => ({
          code: 500,
          message: err.message,
          data: null,
        }));

      if (response?.constellations?.length) {
        const descriptions: string[] = [];

        constellation.forEach((cons, i) => {
          const description = response.constellations[i].description || "[Description missing]";

          descriptions.push(description);
          cons.description = description;
        });

        return {
          code: 200,
          data: descriptions,
        };
      }

      return {
        ...response,
        data: [],
      };
    }

    return {
      code: 200,
      data: [],
    };
  }

  getAllCharacters(): AppCharacter[] {
    return this.characters.map((control) => control.data);
  }

  getCharStatus(name: string) {
    const control = this.getCharacterControl(name);
    return control?.status || "unfetched";
  }

  getCharData(name: string) {
    const control = this.getCharacterControl(name);
    return control!.data;
  }

  getPartyData(party: Party): PartyData {
    return party.map((teammate) => {
      if (teammate) {
        const keys: Array<keyof AppCharacter> = ["code", "name", "icon", "nation", "vision", "weaponType", "EBcost"];
        return pickProps(this.getCharacterControl(teammate.name)!.data, keys);
      }
      return null;
    });
  }

  // ========== WEAPONS ==========

  getAllWeapons(type?: WeaponType) {
    if (type) {
      return this.weapons.reduce<AppWeapon[]>((acc, weapon) => {
        if (weapon.data.type === type) {
          acc.push(weapon.data);
        }
        return acc;
      }, []);
    }

    return this.weapons.map((weapon) => weapon.data);
  }

  getWeaponData(code: number) {
    const control = this.getItemControl("weapons", code)!;
    return control!.data;
  }

  // ========== ARTIFACTS ==========

  getAllArtifacts() {
    return this.artifacts.map((artifact) => artifact.data);
  }

  getArtifactSetData(code: number) {
    // no artifact with code 0
    return code ? this.getItemControl("artifacts", code)?.data : undefined;
  }

  getArtifactData(artifact: { code: number; type: ArtifactType }) {
    const data = this.getArtifactSetData(artifact.code);
    if (data) {
      const { name, icon } = data[artifact.type];
      return { beta: data.beta, name, icon };
    }
    return undefined;
  }

  // ========== MONSTERS ==========

  getAllMonsters() {
    return this.monsters;
  }

  getMonsData({ code }: { code: number }) {
    return findByCode(this.monsters, code);
  }

  getTargetData(target: Target) {
    const dataMonster = this.getMonsData(target);
    let variant = "";
    const statuses: string[] = [];

    if (target.variantType && dataMonster?.variant) {
      for (const type of dataMonster.variant.types) {
        if (typeof type === "string") {
          if (type === target.variantType) {
            variant = target.variantType;
            break;
          }
        } else if (type.value === target.variantType) {
          variant = type.label;
          break;
        }
      }
    }

    if (target.inputs?.length && dataMonster?.inputConfigs) {
      const inputConfigs = toArray(dataMonster.inputConfigs);

      target.inputs.forEach((input, index) => {
        const { label, type = "check", options = [] } = inputConfigs[index] || {};

        switch (type) {
          case "check":
            if (input) {
              statuses.push(label);
            }
            break;
          case "select":
            const option = options[input];
            const selectedLabel = typeof option === "string" ? option : option?.label;

            if (selectedLabel) {
              statuses.push(`${label}: ${selectedLabel}`);
            }
            break;
        }
      });
    }

    return {
      title: dataMonster?.title,
      names: dataMonster?.names,
      variant,
      statuses,
    };
  }
}
