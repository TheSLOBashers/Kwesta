function AboutPage () {
    return (
        <div>
            <h1 style={styles.title}>About Us</h1>
            <p style={styles.text}>We at Kwesta wish to provide people with a real life quest experience. Leave comments and create events for others to participate in!</p>
            <p style={styles.text}>We do not endorse the views of those leaving comments or events on our platform.</p>
            <h1 style={styles.title}>FAQs</h1>
            <h4 style={styles.text}>How do I create comments?</h4>
            <p style={styles.text}>On the home page, click the plus button on the bottom right. There, press the green icon, and a comment form will pop up. Fill it out and submit, and your comment will be seen by everyone else!</p>
            <h4 style={styles.text}>How do I create events?</h4>
            <p style={styles.text}>In the same place as the comments button, there is a blue event creation button. Fill it out with the necessary details, and you'll host an event for others nearby to take place in!</p>
            <h4 style={styles.text}>Why was my comment deleted?</h4>
            <p style={styles.text}>We at Kwesta value safety. Moderating and monitoring comments for threats and personal information is part of our work to keep our community inclusive and friendly to all. If your comment was deleted by a moderator, it may have fallen into one of those categories.</p>
            <h4 style={styles.text}>Why do you collect so much of our data?</h4>
            <p style={styles.text}>Kwesta does not make any money by providing this service to others. To compensate for our time and effort in creating this experience, we sell your data to basically anyone that asks!</p>
            <h4 style={styles.text}>Someone showed up to my house! What do I do?</h4>
            <p style={styles.text}>Run</p>
        </div>
    )
}

const styles = {
    title: {
        fontFamily: "Acephimere"
    },
    text: {
        fontFamily: "Acephimere"
    }
}
    
export default AboutPage;