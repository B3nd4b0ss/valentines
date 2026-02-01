import {useMemo, useRef, useState} from "react";
import "./App.css";

export default function App() {
    const [noCount, setNoCount] = useState(0);
    const [subtitle, setSubtitle] = useState(
        "I was wondering… would you make this Valentine’s Day extra special with me?"
    );
    const [accepted, setAccepted] = useState(false);
    const [chosen, setChosen] = useState("");
    const [customIdea, setCustomIdea] = useState("");
    const [meetTime, setMeetTime] = useState("");

    const noBtnRef = useRef(null);

    const messages = useMemo(
        () => [
            "Are you sure? 🥺",
            "Pleaseeee 😭",
            "That button is broken 😌",
            "Nope, try again 😈",
            "You meant YES 💖",
            "Stop resisting 😤💘",
        ],
        []
    );

    const [noStyle, setNoStyle] = useState({
        position: "relative", // start next to Yes button
        left: "0px",
        top: "0px",
        transform: "scale(1)",
    });

    const options = [
        "Pizza date",
        "Movie night",
        "Ice cream + walk",
        "Fancy dinner",
    ];

    const sendToWhatsApp = (choice, time) => {
        if (!time) {
            setSubtitle("Please pick a time 🕒 before sending!");
            return;
        }

        const phone = import.meta.env.VITE_PHONE_NUMBER;
        const plainText = choice.replace(
            /[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
            ""
        );
        const msg = `Hey! Sooo… Valentine’s Day is around the corner. I was wondering if you’d like to be my partner in crime for a ${plainText.trim()} at ${time}? I promise it’ll be fun!`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
    };

    const handleNo = () => {
        const next = noCount + 1;
        setNoCount(next);

        const scale = Math.max(0.35, 1 - next * 0.12);
        const btn = noBtnRef.current;
        if (!btn) return;

        const padding = 10;
        const maxX = window.innerWidth - btn.offsetWidth - padding;
        const maxY = window.innerHeight - btn.offsetHeight - padding;

        const x = Math.random() * Math.max(0, maxX);
        const y = Math.random() * Math.max(0, maxY);

        setNoStyle({
            position: "fixed",
            left: `${x}px`,
            top: `${y}px`,
            transform: `scale(${scale})`,
        });

        setSubtitle(messages[Math.min(next - 1, messages.length - 1)]);
    };

    const handleYes = () => {
        setAccepted(true);
        setSubtitle("YAY!! 💕 Now choose what we do and pick a time:");
    };

    const chooseOption = (opt) => {
        setChosen(opt);
        sendToWhatsApp(opt, meetTime);
    };

    const submitCustomIdea = (e) => {
        e.preventDefault();
        const trimmed = customIdea.trim();
        if (!trimmed) return;
        const finalChoice = `💡 ${trimmed}`;
        setChosen(finalChoice);
        setCustomIdea("");
        sendToWhatsApp(finalChoice, meetTime);
    };

    const handleTimeChange = (e) => {
        setMeetTime(e.target.value);
        if (chosen) sendToWhatsApp(chosen, e.target.value);
    };

    return (
        <div className="page">
            <main className="card">
                <div className="content">
                    <div className="heart">💘</div>
                    <h1>Will you be my Valentine?</h1>
                    <p className="subtitle">{subtitle}</p>

                    {!accepted && (
                        <div className="buttons">
                            <button className="yes" onClick={handleYes}>
                                Yes 💖
                            </button>
                            <button
                                className="no"
                                ref={noBtnRef}
                                onClick={handleNo}
                                style={noStyle}
                            >
                                No 🙈
                            </button>
                        </div>
                    )}

                    {accepted && (
                        <section className="options">
                            <h2>Pick what we do:</h2>
                            <div className="optionGrid">
                                {options.map((opt) => (
                                    <button
                                        key={opt}
                                        className="option"
                                        onClick={() => chooseOption(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <form className="customBox" onSubmit={submitCustomIdea}>
                                <label className="customLabel">Or type your own idea 😏✨</label>
                                <div className="customRow">
                                    <input
                                        className="customInput"
                                        type="text"
                                        value={customIdea}
                                        onChange={(e) => setCustomIdea(e.target.value)}
                                        placeholder="e.g. Spa day + sushi 🥰"
                                        maxLength={50}
                                    />
                                    <button className="customBtn" type="submit">
                                        Add 💘
                                    </button>
                                </div>
                            </form>

                            <div className="timePicker">
                                <label className="customLabel">Pick a time to meet 🕒</label>
                                <input
                                    type="time"
                                    value={meetTime}
                                    onChange={handleTimeChange}
                                    className="customInput"
                                />
                            </div>

                            {chosen && (
                                <p className="chosen">
                                    Perfect 😍 We’re doing: <span>{chosen}</span> at{" "}
                                    <span>{meetTime || "??"}</span>
                                </p>
                            )}

                            <button
                                className="reset"
                                onClick={() => {
                                    setChosen("");
                                    setCustomIdea("");
                                    setMeetTime("");
                                }}
                            >
                                Choose again ↩
                            </button>
                        </section>
                    )}

                    <p className="footer">Made with love ✨</p>
                </div>
            </main>
        </div>
    );
}
