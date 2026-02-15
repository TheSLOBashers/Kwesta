import { useNavigate } from 'react-router-dom';

function PortalButton(props) {
  const navigate = useNavigate();

    const link = props.link;

    function navigateFunction() {
        navigate(link);
    }

    return <button onClick={() => navigateFunction()}>{props.text}</button>;
}

export default PortalButton;
