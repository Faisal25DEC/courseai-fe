import { lessonAtom } from "@/store/atoms";
import MuxPlayer from "@mux/mux-player-react";
import { UpChunk } from "@mux/upchunk";
import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

const VideoContent = () => {
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const uploadId = useRef<string | null>(null);
  const createUpload = async () => {
    try {
      return fetch("/api/upload", {
        method: "POST",
      })
        .then((res) => res.json())
        .then(({ id, url }) => {
          uploadId.current = id;
          return url;
        });
    } catch (e) {
      console.error("Error in createUpload", e);
    }
  };
  const uploadFile = async (
    file: any,
    moduleId: number,
    index: number,
    filename: any,
    uploadType: string
  ) => {
    const formData = new FormData();
    formData.append("video", file);

    const upload = UpChunk.createUpload({
      endpoint: createUpload,
      file: file,
    });
    upload.on("success", () => {
      try {
        return fetch(`/api/upload/${uploadId?.current}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then(async (data) => {
            const { upload } = data;

            return fetch(`/api/asset/${upload?.asset_id}`, {
              method: "GET",
            });
          })
          .then((res) => res.json())
          .then(async (data: any) => {
            if ("asset" in data) {
              const { playback_id, id, status } = data.asset;
              setCurrentLesson((prev) => ({
                ...prev,
                content: {
                  type: "video",
                  playback_id,
                  asset_id: id,
                },
              }));
            }
          })
          .catch((e) => {
            toast.error("An error occurred.");
          });
      } catch (e) {
        console.error("Error in createUpload", e);
      } finally {
      }
    });
  };

  return (
    <div className="px-8 h-[calc(80vh-160px)]">
      {" "}
      <div className="w-full flex flex-col gap-[16px] text-gray-700 items-center text-[22px] font-semibold">
        Upload Video
        <label
          htmlFor="videoInput"
          className="font-bold w-full mx-auto cursor-pointer border-dashed border-[1px] justify-center flex items-center gap-[16px] p-[12px] rounded-[12px] border-gray-700  text-[32px]"
        >
          <div className="flex flex-col gap-[8px] items-center">
            <img src="/images/fileupload.png" alt="" className="w-12 h-12" />
            <p className="text-gray-700 font-medium underline text-[14px]">
              Click To Upload
            </p>
          </div>
        </label>
        <input
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadFile(file, 1, 1, "filename", "video");
            }
          }}
          type="file"
          id="videoInput"
          className="hidden"
          accept="video/*"
        />
      </div>
      {currentLesson.content?.playback_id && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={currentLesson.content?.playback_id}
          className="h-[40vh] mt-4 !rounded-[20px]"
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoContent;
