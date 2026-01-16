import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import Home from "@pages/home/Home";

import RootLayout from "./_root/RootRayout";
import NotFound from "./_root/pages/NotFound";
import AuthLayout from "./_auth/AuthRayout";
import AppTheme from "./theme";
import FatigueCheck from "@components/ExpoTab/FatigueCheck";
import MapView from "@components/ExpoTab/MapView";

function App() {
  console.log(process.env.REACT_APP_BASE_URL);

  return (
    <ThemeProvider theme={AppTheme}>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* NOTE: 로그인없이 접근할 수 있는 페이지 */}
          <Route element={<RootLayout />}>
            <Route path="/login" element={<NotFound />} />
            <Route path="/fatigueCheck" element={<FatigueCheck />} />
            <Route path="/map" element={<MapView />} />
          </Route>

          {/* NOTE: 로그인해야 접근할 수 있는 페이지 */}
          <Route element={<AuthLayout />}>
            <Route path="/mypage" element={<NotFound />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
