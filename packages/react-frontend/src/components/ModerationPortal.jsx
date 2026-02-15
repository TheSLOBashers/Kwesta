// components/ModerationPortal.jsx
import PortalButton from "./PortalButton";

function ModerationPortal() {
  return (
    <div>
      <h1>Moderation Portal</h1>
      <p>Here is where you would be directed as a moderator</p>
      <div>
        <PortalButton link="/moderation/users" text="Moderate users" />
      </div>
    </div>
  );
}

export default ModerationPortal;
