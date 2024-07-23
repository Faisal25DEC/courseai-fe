import { selectedCameraAtom, selectedMicrophoneAtom } from "@/store/atoms";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  MutableRefObject,
} from "react";
import { useRecoilState } from "recoil";
import webinar from "../../../../assets/images/Webinar-pana.png";
import Image from "next/image";

interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: string;
}

interface ConfigureProps {
  startSession: () => void;
  cameraAllowed: MutableRefObject<boolean>;
  isLoadingSession: boolean;
  setMediaStream: any;
  mediaStreamDevices: any;
  stopMediaTracks: () => void;
}

const Configure: React.FC<ConfigureProps> = ({
  startSession,
  cameraAllowed,
  isLoadingSession,
  setMediaStream,
  mediaStreamDevices,
  stopMediaTracks,
}) => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] =
    useRecoilState<string>(selectedCameraAtom);
  const [selectedMicrophone, setSelectedMicrophone] = useRecoilState<string>(
    selectedMicrophoneAtom
  );
  const { isOpen: isConfigOpen, onOpenChange: onConfigOpenChange } =
    useDisclosure();
  const { isOpen: isInitialOpen, onOpenChange: onInitialOpenChange } =
    useDisclosure({ defaultOpen: true });

  useEffect(() => {
    console.log("Initializing media devices and stream");
    getDevices();
    if (selectedCamera && selectedCamera !== "off") {
      getMediaStream(selectedCamera, selectedMicrophone);
    }
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

    if (videoDevices.length > 0) {
      setSelectedCamera(videoDevices[0].deviceId);
    } else {
      setSelectedCamera("off"); // No cameras available
    }
    console.log("Set devices: ", { videoDevices, audioDevices });
  };

  const handleError = (error: any) => {
    console.error("Error: ", error);
  };

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices);
    } catch (error) {
      handleError(error);
    }
  };

  const ensureMediaStreamStopped = async () => {
    console.log("Ensuring media stream is fully stopped");
    await new Promise((resolve) => setTimeout(resolve, 100)); // Give some time for the tracks to stop
    const devices = await navigator.mediaDevices.enumerateDevices();
    const activeCameras = devices.filter(
      (device) =>
        device.kind === "videoinput" && device.deviceId === selectedCamera
    );
    if (activeCameras.length > 0) {
      console.log("Camera is still active, stopping again");
      stopMediaTracks();
    } else {
      console.log("Camera is inactive");
    }
  };

  const getMediaStream = async (cameraId: string, microphoneId: string) => {
    console.log(
      "Getting media stream for cameraId:",
      cameraId,
      "microphoneId:",
      microphoneId
    );
    stopMediaTracks();

    if (cameraId === "off" && !microphoneId) {
      cameraAllowed.current = false;
      console.log("No camera or microphone selected. Camera allowed:", false);
      return;
    }

    const constraints = {
      video: cameraId !== "off" ? { deviceId: { exact: cameraId } } : false,
      audio: microphoneId ? { deviceId: { exact: microphoneId } } : false,
    };

    try {
      console.log("Requesting new media stream with constraints:", constraints);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (newStream) {
        console.log("New media stream created: ", newStream);
        setMediaStream(newStream);
      } else {
        console.log("Failed to create media stream");
      }
      cameraAllowed.current = cameraId !== "off";
      console.log("Camera allowed:", cameraId !== "off");
    } catch (error) {
      handleError(error);
      cameraAllowed.current = false;
      console.log("Failed to get media stream. Camera allowed:", false);
    }
  };

  const handleCameraChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const cameraId = event.target.value;
    console.log("Selected Camera ID:", cameraId);

    if (cameraId === "off") {
      console.log("Switching off the camera");
      stopMediaTracks();
      await ensureMediaStreamStopped(); // Ensures the media stream is fully stopped
      cameraAllowed.current = false;
      console.log("Camera allowed:", false);
    } else {
      await getMediaStream(cameraId, selectedMicrophone);
    }

    setSelectedCamera(cameraId);
  };

  const handleMicrophoneChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const microphoneId = event.target.value;
    console.log("Selected Microphone ID:", microphoneId);
    setSelectedMicrophone(microphoneId);

    if (selectedCamera !== "off") {
      await getMediaStream(selectedCamera, microphoneId);
    }
  };

  const handleStartSession = async () => {
    if (selectedCamera && selectedMicrophone) {
      await getMediaStream(selectedCamera, selectedMicrophone);
    }
    startSession();
  };

  const handleAllowDevices = async () => {
    try {
      startSession();
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      await getDevices();
      onConfigOpenChange();
    } catch (error) {
      handleError(error);
    }
  };

  const handleContinueWithoutDevices = async () => {
    startSession();
    console.log("Continuing without camera and microphone");
    setSelectedCamera("off");
    setSelectedMicrophone("");
    stopMediaTracks();
    await ensureMediaStreamStopped(); // Ensures the media stream is fully stopped
    cameraAllowed.current = false;
    onConfigOpenChange();
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

  return (
    <>
      {/* <Modal isOpen={isInitialOpen} onOpenChange={onInitialOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <div className="py-5">
                <ModalBody>
                  <p className="text-md pt-2">Allow Access to Devices</p>
                </ModalBody>
                <div className="flex justify-center">
                  <Image src={webinar} alt="" width={250} height={250} />
                </div>
                <ModalFooter>
                  <div className="w-full gap-4 flex flex-col items-center justify-center">
                    <Button
                      size="sm"
                      className="rounded-full cursor-pointer"
                      color="primary"
                      onClick={() => handleAllowDevices()}
                    >
                      Allow Microphone and Camera
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => handleContinueWithoutDevices()}
                    >
                      Continue without Camera and Microphone
                    </Button>
                  </div>
                </ModalFooter>
              </div>
            </>
          )}
        </ModalContent>
      </Modal> */}

      <div className="flex flex-col items-center justify-center w-[400px]">
        <div className="flex gap-2 items-center flex-col">
          <h1 className="font-semibold text-lg text-gray-600">
            Allow Access to Devices
          </h1>
        </div>
        <div className="flex pt-10">
          <Icon icon="lucide:ear" className="text-gray-400 w-5 h-5" />
          <p className="text-sm text-center text-gray-400">
            Works optimally in a noise-free area with dependable internet
            connectivity.
          </p>
        </div>
        <Image src={webinar} alt="" width={250} height={250} />

        {isLoadingSession && (
          <Button
            size="sm"
            className="start-gradient rounded-full cursor-pointer"
            color="primary"
            onClick={() => handleAllowDevices()}
          >
            <Spinner size="sm" color="default" className="text-white" />{" "}
            Requesting agent...
          </Button>
        )}
        {!isLoadingSession && (
          <div className="w-full gap-4 flex flex-col items-center justify-center">
            <Button
              size="sm"
              className="start-gradient rounded-full cursor-pointer"
              color="primary"
              onClick={() => handleAllowDevices()}
            >
              Allow Microphone and Camera
            </Button>
            <Button
              size="sm"
              className="rounded-full cursor-pointer"
              onClick={() => handleContinueWithoutDevices()}
            >
              Continue without Camera and Microphone
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Configure;
