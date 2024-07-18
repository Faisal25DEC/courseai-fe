import { selectedCameraAtom } from "@/store/atoms";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useRecoilState } from "recoil";

function CameraAllow() {
  const [selectedCamera, setSelectedCamera] =
    useRecoilState(selectedCameraAtom);
  return (
    <div
      className={`bg-white hover:bg-gray-100 h-[35px] flex justify-center items-center shadow-1 text-white cursor-pointer px-4 py-2 rounded-[10px]`}
    >
      {selectedCamera !== "off" ? (
        <Icon
          icon="streamline:webcam-video-off-solid"
          className="text-white w-5 h-5"
        />
      ) : (
        <Icon
          icon="streamline:webcam-video-solid"
          className="text-gray-800 w-4 h-4"
        />
      )}
    </div>
  );
}

export default CameraAllow;
