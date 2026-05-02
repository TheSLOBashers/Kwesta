// src/MyApp.jsx
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/Navbar";
//import OverlayNavbar from "./components/OverlayNavbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import loginCall from "./APICalls/loginCall";
import signupCall from "./APICalls/signupCall";
import AuthenticationRoute from "./components/AuthenticationRoute";
import ModerationRoute from "./components/ModerationRoute";
import ModerationPortal from "./components/ModerationPortal";
import ModerateUsers from "./components/ModerateUsers";
import ModerateComments from "./components/ModerateComments";
import ModerateQuests from "./components/ModerateQuests";
import AddModerator from "./components/AddModerator";
import AddQuest from "./components/AddQuest";
import AddComment from "./components/ModerationAddComment";
import AboutPage from "./components/AboutPage";
import EntryPage from "./components/EntryPage";
import MonitorDBNetworkRequests from "./components/Monitor_db_net_requests";
import MonitorDBPage from "./components/MonitorDBPage"

function MyApp() {
  const [user, setUser] = useState(
    () => localStorage.getItem("username") || null
  );

  return (
    // <TopBar userPoints={userPoints} />
    <div className="top-container">

      <main>
        <Routes>
          <Route element={<AuthenticationRoute />}>
            <Route
              path="/Login"
              element={
                <Login
                  handleSubmit={loginCall}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/Signup"
              element={<Signup handleSubmit={signupCall} />}
            />
          </Route>
          <Route element={<ModerationRoute />}>
            <Route
              path="/moderation/Portal"
              element={<ModerationPortal />}
            />
            <Route
              path="/moderation/users"
              element={<ModerateUsers />}
            />
            <Route
              path="/moderation/comments"
              element={<ModerateComments />}
            />
            <Route
              path="/moderation/quests"
              element={<ModerateQuests />}
            />
            <Route
              path="/moderation/add-moderator"
              element={<AddModerator />}
            />
            <Route
              path="/moderation/add-quest"
              element={<AddQuest />}
            />
            <Route
              path="/moderation/add-comment"
              element={<AddComment />}
            />
            <Route
              path="/monitoring/db-network-requests"
              element={<MonitorDBPage title="Monitor DB Network Requests" description="Review and filter database network requests" analyticName="NETWORK_NUM_REQUESTS" chartTitle="Network Requests" />}
            />
            <Route
              path="/monitoring/db-connections"
              element={<MonitorDBPage title="Monitor DB Connections" description="Review and filter database connections" analyticName="CONNECTIONS" chartTitle="Network Connections" />}
            />
            <Route
              path="/monitoring/db-opcounter-query"
              element={<MonitorDBPage title="Monitor DB Operation Counter Query" description="Review and filter database operation counter queries" analyticName="OPCOUNTER_QUERY" chartTitle="Operation Counter Queries" />}
            />
            <Route
              path="/monitoring/db-opcounter-update"
              element={<MonitorDBPage title="Monitor DB Operation Counter Update" description="Review and filter database operation counter updates" analyticName="OPCOUNTER_UPDATE" chartTitle="Operation Counter Updates" />}
            />
            <Route
              path="/monitoring/db-opcounter-delete"
              element={<MonitorDBPage title="Monitor DB Operation Counter Delete" description="Review and filter database operation counter deletes" analyticName="OPCOUNTER_DELETE" chartTitle="Operation Counter Deletes" />}
            />
            <Route
              path="/monitoring/db-opcounter-insert"
              element={<MonitorDBPage title="Monitor DB Operation Counter Insert" description="Review and filter database operation counter inserts" analyticName="OPCOUNTER_INSERT" chartTitle="Operation Counter Inserts" />}
            />
            <Route
              path="/monitoring/db-logical-size"
              element={<MonitorDBPage title="Monitor DB Logical Size" description="Review and filter database logical size" analyticName="LOGICAL_SIZE" chartTitle="Logical Size" />}
            />
            <Route
              path="/monitoring/db-FTS_PROCESS_VIRTUAL_MEMORY"
              element={<MonitorDBPage title="Monitor DB FTS Process Virtual Memory" description="Review and filter database FTS process virtual memory" analyticName="FTS_PROCESS_VIRTUAL_MEMORY" chartTitle="FTS Process Virtual Memory" />}
            />
            <Route
              path="/monitoring/FTS_PROCESS_CPU_KERNEL"
              element={<MonitorDBPage title="Monitor DB FTS Process CPU Kernel" description="Review and filter database FTS process CPU kernel" analyticName="FTS_PROCESS_CPU_KERNEL" chartTitle="FTS Process CPU Kernel" />}
            />
            <Route
              path="/monitoring/FTS_PROCESS_RESIDENT_MEMORY"
              element={<MonitorDBPage title="Monitor DB FTS Process Resident Memory" description="Review and filter database FTS process resident memory" analyticName="FTS_PROCESS_RESIDENT_MEMORY" chartTitle="FTS Process Resident Memory" />}
            />
            <Route
              path="/monitoring/FTS_DISK_USAGE"
              element={<MonitorDBPage title="Monitor DB FTS Disk Usage" description="Review and filter database FTS disk usage" analyticName="FTS_DISK_USAGE" chartTitle="FTS Disk Usage" />}
            />
            <Route
              path="/monitoring/OPCOUNTER_CMD"
              element={<MonitorDBPage title="Monitor DB Operation Counter Command" description="Review and filter database operation counter commands" analyticName="OPCOUNTER_CMD" chartTitle="Operation Counter Commands" />}
            />
          </Route>
          <Route path="/About" element={<AboutPage />} />
          <Route path="/" element={<EntryPage />} />
        </Routes>
      </main>

      <NavBar />
    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;
