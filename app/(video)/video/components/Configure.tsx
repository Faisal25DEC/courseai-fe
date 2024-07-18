import { selectedCameraAtom, selectedMicrophoneAtom } from "@/store/atoms";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Spinner } from "@nextui-org/react";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  MutableRefObject,
} from "react";
import { useRecoilState } from "recoil";

interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: string;
}

interface ConfigureProps {
  startSession: () => void;
  cameraAllowed: MutableRefObject<boolean>;
  isLoadingSession: boolean;
}

const Configure: React.FC<ConfigureProps> = ({
  startSession,
  cameraAllowed,
  isLoadingSession,
}) => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  
  const [selectedCamera, setSelectedCamera] =
    useRecoilState<string>(selectedCameraAtom);

  const [selectedMicrophone, setSelectedMicrophone] = useRecoilState<string>(
    selectedMicrophoneAtom
  );

  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices(devices);
      } catch (error) {
        console.error("Error fetching media devices:", error);
      }
    }

    getDevices();
  }, []);

  const setDevices = (deviceInfos: MediaDeviceInfo[]) => {
    const videoDevices = deviceInfos.filter(
      (device) => device.kind === "videoinput"
    );
    const audioDevices = deviceInfos.filter(
      (device) => device.kind === "audioinput"
    );
    setCameras(videoDevices);
    setMicrophones(audioDevices);

    if (audioDevices.length > 0) {
      setSelectedMicrophone(audioDevices[0].deviceId);
    } else {
      setSelectedMicrophone(""); // No microphones available
    }

    setSelectedCamera("off");
  };

  const handleError = (error: any) => {
    console.error("Error: ", error);
  };

  const getMediaStream = async (cameraId: string, microphoneId: string) => {
    if (cameraId === "off" && !microphoneId) {
      cameraAllowed.current = false;
      console.log("camera allowed ", false);
      return;
    }

    const constraints = {
      video: cameraId !== "off" ? { deviceId: { exact: cameraId } } : false,
      audio: microphoneId ? { deviceId: { exact: microphoneId } } : false,
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraAllowed.current = cameraId !== "off";
      console.log("camera allowed ", cameraId !== "off");
    } catch (error) {
      handleError(error);
      cameraAllowed.current = false;
      console.log("camera allowed ", false);
    }
  };

  const handleCameraChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const cameraId = event.target.value;
    setSelectedCamera(cameraId);
  };

  const handleMicrophoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const microphoneId = event.target.value;
    setSelectedMicrophone(microphoneId);
  };

  const handleStartSession = async () => {
    await getMediaStream(selectedCamera, selectedMicrophone);
    startSession();
  };

  const cameraOptions = [
    <option key="off" value="off">
      Switch off
    </option>,
    ...cameras.map((camera) => (
      <option key={camera.deviceId} value={camera.deviceId}>
        {camera.label}
      </option>
    )),
  ];

  const microphoneOptions = microphones.map((microphone) => (
    <option key={microphone.deviceId} value={microphone.deviceId}>
      {microphone.label}
    </option>
  ));

  console.log("Selected Camera:", selectedCamera);
  console.log("Selected Microphone:", selectedMicrophone);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-[400px]">
        <div className="flex gap-2 items-center flex-col">
          <h1 className="font-semibold text-lg text-gray-600">
            Configure your devices
          </h1>
          <p className="w-[70%] text-center text-[16px] text-gray-400">
            Please configure your camera and microphone below
          </p>
        </div>
        <div className="flex pt-10">
          <Icon icon="lucide:ear" className="text-gray-400 w-5 h-5" />
          <p className="text-sm text-center text-gray-400">
            Works optimally in a noise-free area with dependable internet
            connectivity.
          </p>
        </div>
        <div className="flex flex-col w-full my-4">
          <label className="text-sm pb-2 text-gray-400">Camera:</label>
          <select
            className="custom-select"
            onChange={handleCameraChange}
            value={selectedCamera}
          >
            {cameraOptions}
          </select>
        </div>
        <div className="flex flex-col w-full my-4">
          <label className="text-sm pb-2 text-gray-400">Microphone:</label>
          <select
            className="custom-select"
            onChange={handleMicrophoneChange}
            value={selectedMicrophone}
          >
            {microphoneOptions}
          </select>
        </div>
        <Button
          color="primary"
          className="start-gradient mt-8"
          onClick={handleStartSession}
          disabled={selectedCamera === "" || selectedMicrophone === ""}
        >
          {isLoadingSession ? (
            <>
              <Spinner size="sm" color="default" className="text-white" />{" "}
              Requesting agent...
            </>
          ) : (
            "Let's go"
          )}
        </Button>
      </div>
    </>
  );
};

export default Configure;
