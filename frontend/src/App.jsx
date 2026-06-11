import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState([]);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    console.log("Upload button clicked");

    if (!file) {
      alert("Select a file first");
      return;
    }

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Sending request...");

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      console.log("Response:", response);

      setMessage(`Uploaded: ${response.data.filename}`);

      setOcrText(response.data.text);

    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>InfraSight AI</h1>

      <h3>Upload Architecture Diagram</h3>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <br />
      <br />

      <button onClick={handleUpload}>
        Upload
      </button>

      <h2>Detected Text</h2>

      <ul>
        {ocrText.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <p>{message}</p>
    </div>
  );
}

export default App;