export function adjustDatabase(data: any) {
  // if (!data.Setups) data.Setups = [];
  // const { version = 0 } = data;
  // if (!version) {
  //   changeArtIDsAndParty(data);
  // }
  // if (version < 2) changeWpNameToCode(data);
  // if (version < 2.1) changeArtNameToCode(data);

  // const allOutdates = [];
  // for (const st of data.Setups) {
  //   if (st.type === "complex") continue;
  //   const list = extractOutdatedCharMCs(st).concat(extractOutdatedWpMCs(st));
  //   if (list.length) {
  //     allOutdates.push({
  //       name: st.name,
  //       members: [st.char.name].concat(
  //         st.party.filter((tm) => tm).map((tm) => tm.name)
  //       ),
  //       list
  //     });
  //   }
  // }
  // return [data, allOutdates.length ? allOutdates : null];
  return [] as any[];
}
