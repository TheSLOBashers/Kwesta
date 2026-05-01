import { useNavigate } from 'react-router-dom';

function Dash_option(props) { // props.title, props.options = [{text: "option1", link: "/option1"}, {text: "option2", link: "/option2"}], props.width
  const navigate = useNavigate();

  function navigateFunction(link) {
    navigate(link);
  }

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
      padding: "0.5rem",
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
    <div style = {styles.dash_option} key={`${props.title}-dash-option`}>
      <h4 key={`${props.title}-dash-option-title`} style={styles.title}>
        {props.title}
      </h4>
      {props.options.map((option, i) => {
        return (<div key={`${option}-${i}-hr`} style = {styles.item}><hr style={styles.hr} key={`${option}-${i}-hr`} /><button key={`${option}-${i}-b`} style={styles.button} onClick={() => navigateFunction(option.link)}>{option.text}</button></div>)
      })}

    </div>);
}

export default Dash_option;
