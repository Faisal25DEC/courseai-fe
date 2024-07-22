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
  useRef,
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
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const { isOpen: isConfigOpen, onOpenChange: onConfigOpenChange } =
    useDisclosure();
  const { isOpen: isInitialOpen, onOpenChange: onInitialOpenChange } =
    useDisclosure({ defaultOpen: true });

  useEffect(() => {
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

    if (videoDevices.length > 0) {
      setSelectedCamera(videoDevices[0].deviceId);
    } else {
      setSelectedCamera("off"); // No cameras available
    }
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

  const getMediaStream = async (cameraId: string, microphoneId: string) => {
    if (mediaStreamRef.current) {
      console.log("Stopping existing media stream");
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

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
      console.log("Requesting new media stream with constraints:", constraints);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = newStream;
      cameraAllowed.current = cameraId !== "off";
      console.log("New media stream created, camera allowed:", cameraId !== "off");
    } catch (error) {
      handleError(error);
      cameraAllowed.current = false;
      console.log("camera allowed ", false);
    }
  };

  const handleCameraChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const cameraId = event.target.value;
    console.log("Selected Camera ID:", cameraId);
    setSelectedCamera(cameraId);

    if (cameraId === "off") {
      if (mediaStreamRef.current) {
        console.log("Stopping all tracks as camera is switched off");
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        cameraAllowed.current = false;
        console.log("camera allowed ", false);
      }
    } else {
      await getMediaStream(cameraId, selectedMicrophone);
    }
  };

  const handleMicrophoneChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const microphoneId = event.target.value;
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

  const handleAllowDevices = async (onClose: () => void) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      await getDevices();
      onClose();
      onConfigOpenChange();
    } catch (error) {
      handleError(error);
    }
  };

  const handleContinueWithoutDevices = (onClose: () => void) => {
    setSelectedCamera("off");
    setSelectedMicrophone("");
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    cameraAllowed.current = false;
    onClose();
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
      <Modal isOpen={isInitialOpen} onOpenChange={onInitialOpenChange}>
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
                      onClick={() => handleAllowDevices(onClose)}
                    >
                      Allow Microphone and Camera
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => handleContinueWithoutDevices(onClose)}
                    >
                      Continue without Camera and Microphone
                    </Button>
                  </div>
                </ModalFooter>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>

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
