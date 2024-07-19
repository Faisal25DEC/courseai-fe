import AudioButtons from "@/components/shared/audio-buttons/audio-buttons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiKey, heygenBaseUrl, specificAvatarIds } from "@/lib/constants";
import {
  avatarsAtom,
  lessonAtom,
  selectedAvatarAtom,
  voicesAtom,
} from "@/store/atoms";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Card, Skeleton, Spinner } from "@nextui-org/react";

const AvatarContent = () => {
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [avatars, setAvatars] = useRecoilState<any>(avatarsAtom);
  const [voices, setVoices] = useRecoilState<any>(voicesAtom);
  const [loading, setLoading] = useState(true);
  const [currentSelectedAvatar, setcurrentSelectedAvatar] =
    useRecoilState<any>(selectedAvatarAtom);
  const fetchAvatarsAndVoices = async () => {
    const { data: voicesData } = await axios.get(
      `${heygenBaseUrl}/v1/voice.list`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
      }
    );

    const { data: avatarsData } = await axios.get(
      `${heygenBaseUrl}/v2/avatars`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
      }
    );

    console.log("avatars data ", avatarsData);

    let allAvatars = avatarsData.data.avatars.map((item: any) => {
      return {
        avatar_id: item.avatar_id,
        avatar_name: item.avatar_name,
        gender: item.gender,
        preview_image_url: item.preview_image_url,
        preview_video_url: item.preview_video_url,
      };
    });

    console.log("all avatar", allAvatars);

    allAvatars = allAvatars.filter((avatar: any) =>
      specificAvatarIds.includes(avatar.avatar_id)
    );

    const filteredVoices = voicesData.data.list.filter(
      (item: any) => item.language === "English"
    );

    console.log("voices", filteredVoices);

    const maleAvatars = allAvatars.filter(
      (avatar: any) => avatar.gender.toLowerCase() === "male"
    );

    const femaleAvatars = allAvatars.filter(
      (avatar: any) => avatar.gender.toLowerCase() === "female"
    );

    const maleVoices = filteredVoices.filter(
      (voice: any) => voice.gender.toLowerCase() === "male"
    );

    const femaleVoices = filteredVoices.filter(
      (voice: any) => voice.gender.toLowerCase() === "female"
    );

    const selectedAvatars = [...maleAvatars, ...femaleAvatars].slice(0, 7);
    const selectedVoices = [...maleVoices, ...femaleVoices];

    const matchedAvatarsAndVoices = selectedAvatars.map((avatar, index) => {
      const matchingVoice =
        avatar.gender.toLowerCase() === "male"
          ? maleVoices[index % maleVoices.length]
          : femaleVoices[index % femaleVoices.length];
      return { ...avatar, voice: matchingVoice };
    });

    setAvatars(matchedAvatarsAndVoices || []);
    setVoices(selectedVoices || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAvatarsAndVoices();
  }, []);

  useEffect(() => {
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        type: "avatar",
        avatar: avatars[0] || {},
        voice: voices[0] || {},
        avatar_id: avatars[0]?.avatar_id || "",
        voice_id: voices[0]?.voice_id || "",
        prompt: currentLesson?.content?.prompt || "",
      },
    }));
  }, [avatars, voices]);

  const handleChangeAvatar = (avatar: any, index: number) => {
    setcurrentSelectedAvatar(index);
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        avatar: avatar || {},
        avatar_id: avatar?.avatar_id || "",
      },
    }));
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        prompt: e.target.value,
      },
    }));
  };

  return (
    <div className="px-8 flex flex-col gap-8 my-2 overflow-y-scroll h-[calc(80vh-200px)]">
      <div className="label-container">
        <p className="label">Avatars</p>
        <div className="flex flex-wrap items-center gap-4">
          {!loading ? (
            avatars.map((avatar: any, idx: number) => (
              <div
                onClick={() => handleChangeAvatar(avatar, idx)}
                key={idx}
                className={` flex flex-col items-center gap-2`}
              >
                <img
                  className={`${
                    currentSelectedAvatar === idx
                      ? "border-[2px] border-gray-800"
                      : "border-1 border-gray-200"
                  } w-24 h-24 rounded-[20px] object-cover`}
                  src={avatar.preview_image_url}
                  alt={avatar.avatar_name}
                />
                <p className="text-xs text-gray-600">{avatar.avatar_name}</p>
              </div>
            ))
          ) : (
            <Card className="w-[150px] space-y-2 p-1" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>
            </Card>
          )}
        </div>
      </div>
      <div className="label-container">
        <p className="label">Voices</p>
        <div className="flex flex-wrap items-center gap-4">
          <AudioButtons gender={currentLesson.content?.avatar.gender} />
          <audio className="hidden" id="audio" controls autoPlay={false} />
        </div>
      </div>
      <div className="label-container">
        <p className="label">Prompt</p>
        <Textarea
          value={currentLesson.content?.prompt}
          onChange={handlePromptChange}
          rows={10}
          placeholder="Write Your Prompt Here..."
        />
      </div>
    </div>
  );
};

export default AvatarContent;
