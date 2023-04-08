import "./message.css"

const Message = ({data}) => {
    return (
        <div className="message">
            {
                data.you ?
                    <div className="content you">{data.content}</div>
                    :
                    <div className="content not-you">{data.content}</div>
            }
        </div>
    )
}

export default Message