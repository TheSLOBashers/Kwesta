function Protected() {

    let token = localStorage.getItem('authToken')

    return (
        <div>
            <h1>Protected</h1>
            <p>Your JWT is {token}</p>
        </div>
    );
}

export default Protected;