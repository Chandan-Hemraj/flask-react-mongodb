import { HashRouter, Routes, Route } from "react-router-dom";
import { Users } from "@/pages/Users";
import { Layout } from "@/components/Layout";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Users/>}/>
          <Route path="/users" element={<Users />}/>
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App;
