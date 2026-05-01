function EntryPage () {
    return (
        <div style ={styles.page}>
            <div style={styles.gradient}>
                <h1 style={styles.title}>Welcome to Kwesta!</h1>
                <p style={styles.text}>Kwesta is a platform for sharing real life quests and events with others. Create your own quests, comment on others, and participate in events nearby!</p>
            </div>
        </div>
    )
}

const styles = {
    gradient: {
        flex: 1,
        padding: "2rem",
        background: "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(86, 83, 237, 1) 100%)",
    },
    page: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    title: {
        fontFamily: "Acephimere",
        color: "white",
    },
    text: {
        fontFamily: "Acephimere",
        color: "white",
    }
}
    
export default EntryPage;