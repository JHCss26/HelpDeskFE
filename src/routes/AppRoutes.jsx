import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";


const PrivateRoute = React.lazy(() => import("./PrivateRoute"));
const NavigateToRoleDashboard = React.lazy(() => import("./NavigateToRoleDashboard"));
const RoleRoute = React.lazy(() => import("./RoleRoute"));
const AgentDashboard = React.lazy(() => import("../pages/agent/AgentDashboard"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const Dashboard = React.lazy(() => import("../pages/users/Dashboard"));
const CreateTicket = React.lazy(() => import("../pages/tickets/CreateTicket"));
const TicketDetails = React.lazy(() => import("../pages/tickets/TicketDetails"));
const ManageUsers = React.lazy(() => import("../pages/admin/ManageUsers"));
const ManageCategories = React.lazy(() => import("../pages/admin/ManageCategories"));
const ManageDepartments = React.lazy(() => import("../pages/admin/ManageDepartments"));
const TicketBoard = React.lazy(() => import("../pages/tickets/TicketBoard"));
const SetupPassword = React.lazy(() => import("../pages/auth/SetupPassword"));
const UserDetails = React.lazy(() => import("../pages/admin/UserDetails"));
const SLASettingsPage = React.lazy(() => import("../pages/admin/SLASettingsPage"));
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));
const Tickets = React.lazy(() => import("../pages/tickets/Tickets"));
const Admin = React.lazy(() => import("../pages/admin/Admin"));
const Agent = React.lazy(() => import("../pages/agent/Agent"));
const User = React.lazy(() => import("../pages/users/User"));
const AdminManager = React.lazy(() => import("../pages/admin/AdminManager"));
const ResetPassword = React.lazy(() => import("../pages/auth/ResetPassword"));
const ForgotPassword = React.lazy(() => import("../pages/auth/ForgotPassword"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const Login = React.lazy(() => import("../pages/auth/Login"));

export default function AppRoutes() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/register"
        element={
          <Register />
        }
      />
      <Route path="/setup-password/:token" element={<SetupPassword />} />
      <Route
        path="/reset-password/:token"
        element={
          <ResetPassword />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />
      
      {/* Protected */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<NavigateToRoleDashboard />} />

        {/* Tickets */}
        <Route
          path="/tickets"
          element={
            <RoleRoute allowedRoles={["user", "admin", "agent"]}>
              <Tickets />
            </RoleRoute>
          }
        >
          <Route index element={<TicketBoard />} />
          <Route
            path="all"
            element={
              <RoleRoute allowedRoles={["user", "admin", "agent"]}>
                <TicketBoard />
              </RoleRoute>
            }
          />
          <Route
            path="create"
            element={
              <RoleRoute allowedRoles={["user", "admin", "agent"]}>
                <CreateTicket />
              </RoleRoute>
            }
          />
          <Route
            path=":id"
            element={
              <RoleRoute allowedRoles={["user", "admin", "agent"]}>
                <TicketDetails />
              </RoleRoute>
            }
          />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Admin />
            </RoleRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route path="manage" element={<AdminManager />}>

            <Route
              path="categories"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <ManageCategories />
                </RoleRoute>
              }
            />

            <Route
              path="departments"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <ManageDepartments />
                </RoleRoute>
              }
            />
            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <ManageUsers />
                </RoleRoute>
              }
            />

            <Route
              path="users/:id"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <UserDetails />
                </RoleRoute>
              }
            />

            <Route
              path="sla-settings"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <SLASettingsPage />
                </RoleRoute>
              }
            />

            <Route index element={<Navigate to="/admin/manage/users" />} />
          </Route>

          <Route index element={<Navigate to="/admin/dashboard" />} />
        </Route>

        <Route
          path="/agent"
          element={
            <RoleRoute allowedRoles={["agent"]}>
              <Agent />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/agent/dashboard" />} />
          <Route
            path="dashboard"
            element={
              <RoleRoute allowedRoles={["agent"]}>
                <AgentDashboard />
              </RoleRoute>
            }
          />
        </Route>

        {/* User */}
        <Route
          path="/user"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <User />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/user/dashboard" />} />
          <Route
            path="dashboard"
            element={
              <RoleRoute allowedRoles={["user"]}>
                <Dashboard />
              </RoleRoute>
            }
          />
        </Route>
      </Route>

      {/* Final Catch-All Route */}
      <Route
        path="*"
        element={
          token ? (
            <NavigateToRoleDashboard />
          ) : (
            <div className="p-6 text-center text-lg">404 — Page Not Found</div>
          )
        }
      />
    </Routes>
  );
}
