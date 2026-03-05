// components/ModerationPortal.jsx
import PortalButton from "./PortalButton";

function ModerationPortal() {
  return (
    <div>
      <h1>Moderation Portal</h1>
      <p>Here is where you would be directed as a moderator</p>
      <table>
        <thead>
          <tr>
            <th>Users</th>
            <th>Comments</th>
            <th>Quests</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><PortalButton link="/moderation/users" text="Moderate users" /></td>
            <td><PortalButton link="/moderation/comments" text="Moderate comments" /></td>
            <td><PortalButton link="/moderation/quests" text="Moderate Quests" /></td>
          </tr>
          <tr>
            <td><PortalButton link="/moderation/add-moderator" text="Add Moderator" /></td>
            <td><PortalButton link="/moderation/add-comment" text="Add Comment" /></td>
            <td><PortalButton link="/moderation/add-quest" text="Add Quest" /></td>
          </tr>
        </tbody>
        
      </table>
    </div>
  );
}

export default ModerationPortal;
