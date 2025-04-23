const Notification = ({ message, messageType }) => {


    if (message !== null && messageType === 'error') {
        return (
            <div className="errorStyle">
                {message}
            </div>
        )
    }
    else if (message !== null) {
        return (
            <div className="notificationStyle">
                {message}
            </div>
        )
    }
}

export default Notification