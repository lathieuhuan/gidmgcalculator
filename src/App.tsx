import { NavBar } from "@Components/NavBar";
import Calculator from "@Screens/Calculator";

function App() {
  // const atScreen = useSelector((state) => state.ui.atScreen);

  return (
    <div className="App text-default flex flex-col">
      <NavBar />
      <div className="grow flex-center relative">
        <Calculator />
        {/* <Button onClick={() => setBoo(!boo)}>Click</Button>
        <div className="bg-darkblue-3" style={{ width: 300 }}>
          <AttributeTable attributes={testAttrs} />
        </div> */}
      </div>
    </div>
  );
}

export default App;
