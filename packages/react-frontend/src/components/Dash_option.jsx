import { useNavigate } from 'react-router-dom';

function Dash_option(props) { // props.title, props.options = [{text: "option1", link: "/option1"}, {text: "option2", link: "/option2"}], props.width
  const navigate = useNavigate();

  function navigateFunction(link) {
    navigate(link);
  }

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    margin: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
  };

  const styles = {
    dash_option: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "left",
      textAlign: "left",
      flex: 1,
      border: "4px solid #8b8b8b",
      borderRadius: "5px",
      width: props.width,
      margin: "1rem",
      background: "white",
      fontFamily: "Times New Roman",
    },
    hr: {
      width: "100%",
      border: "2px solid #8b8b8b",
      margin: "0"
    },
    item: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      justifyContent: "center",
      textAlign: "left",
      flex: 1,
    },
    button: {
      width: "100%",
      padding: "1rem",
      border: "none",
      background: "white",
      color: "#8b8b8b",
      fontFamily: "Times New Roman",
      textAlign: "left",
    },
    title: {
      fontFamily: "Times New Roman",
      color: "#8b8b8b",
      textAlign: "left",
      padding: "0.5rem",
    }

  }

  return (
    <div style={cardStyle} key={`${props.title}-dash-option`}>
      <h6 key={`${props.title}-dash-option-title`} style={{ fontWeight: "600", color: "#0f172a", padding: "10px", marginTop: "0.5em" }}>
        {props.title}
      </h6>

      {props.options.map((option, i) => {
        return (<div key={`${option}-${i}-hr`} style={styles.item}><hr style={styles.hr} key={`${option}-${i}-hr`} /><button key={`${option}-${i}-b`} style={styles.button} onClick={() => navigateFunction(option.link)}>{option.text}</button></div>)
      })}

    </div>);
}

export default Dash_option;
