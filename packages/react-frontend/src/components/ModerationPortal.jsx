// components/ModerationPortal.jsx
import PortalButton from "./PortalButton";
import Dash_option from "./Dash_option";

function ModerationPortal() {
  return (
    <div style={styles.page}>
      <h1>Moderation Portal</h1>
      <p>Here is where you would be directed as a moderator</p>
      <Dash_option title = {"Manage users"} options={[{text: "Moderate users", link: "/moderation/users"}]} width = {"90%"}></Dash_option>
      <Dash_option title = {"Manage comments"} options={[{text: "Moderate comments", link: "/moderation/comments"}, {text: "Add Comment", link: "/moderation/add-comment"}]} width = {"90%"}></Dash_option>
      <Dash_option title = {"Manage quests"} options={[{text: "Moderate quests", link: "/moderation/quests"}, {text: "Add Quest", link: "/moderation/add-quest"}]} width = {"90%"}></Dash_option>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    background: "#f9f9ff",
  },
}

export default ModerationPortal;
