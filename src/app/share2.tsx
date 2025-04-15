import React from "react";

const pc = new RTCPeerConnection();
const CHANNEL = "ocw-share";

export default function Share2() {
  const [offerData, setOfferData] = React.useState<string | null>(null);
  const [answerData, setAnswerData] = React.useState<string | null>(null);
  const channelRef = React.useRef<RTCDataChannel | null>(null);

  const setupDataChannel = React.useCallback((channel: RTCDataChannel) => {
    channel.onopen = () => console.log("Data channel open");
    channel.onmessage = (e) => {
      console.log("Data channel message", e);
    };
    channelRef.current = channel;
  }, []);

  const offer = React.useCallback(async () => {
    const channel = pc.createDataChannel(CHANNEL);
    setupDataChannel(channel);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    pc.onicecandidate = (e) => {
      console.log("ICE candidate", e);
      if (!e.candidate) {
        setOfferData(JSON.stringify(pc.localDescription));
      }
    };
  }, [setupDataChannel]);

  const acceptOffer = React.useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const json = e.target.value;
      const remoteDesc = new RTCSessionDescription(JSON.parse(json));
      await pc.setRemoteDescription(remoteDesc);

      pc.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      //setAnswerData(JSON.stringify(pc.localDescription));

      pc.onicecandidate = (e) => {
        console.log("ICE b", e);
        if (!e.candidate) {
          setAnswerData(JSON.stringify(pc.localDescription));
        }
      };
    },
    [setupDataChannel],
  );

  const confirmOffer = React.useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const remoteDesc = new RTCSessionDescription(JSON.parse(e.target.value));
      await pc.setRemoteDescription(remoteDesc);
    },
    [],
  );

  const sendMessage = React.useCallback(() => {
    channelRef.current?.send("Hello from the other side");
  }, []);

  return (
    <main>
      <h1>Share</h1>
      <button onClick={offer}>Offer</button>
      {offerData && <textarea value={offerData} readOnly cols={50} rows={50} />}
      <h1>Confirm Offer</h1>
      <div>
        <textarea onChange={confirmOffer} />
      </div>

      <h1>Accept Offer</h1>
      <div>
        <textarea onChange={acceptOffer} />
      </div>
      <div>
        <h1>Answer data</h1>
        {answerData && (
          <textarea value={answerData} readOnly cols={50} rows={50} />
        )}
      </div>
      <div>
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </main>
  );
}
