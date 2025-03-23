import { Routes, Route } from "react-router-dom";
import { allRoutes } from "./routeConfig";

// Helper function to render routes recursively
const renderRoutes = (routes: any[]) => {
  return routes.map((route) => {
    // If the route has children, render them recursively
    if (route.children && route.children.length > 0) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    // Otherwise, render a simple route
    return (
      <Route key={route.path} path={route.path} element={route.element} />
    );
  });
};

const AppRoutes = () => {
  return (
    <Routes>
      {renderRoutes(allRoutes)}
    </Routes>
  );
};

export default AppRoutes;
