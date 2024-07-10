import AudioButtons from "@/components/shared/audio-buttons/audio-buttons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getFilteredVoiceAndAvatarObjects } from "@/lib/ArrayHelpers/ArrayHelpers";
import { apiKey, heygenBaseUrl } from "@/lib/constants";
import { avatarsAtom, lessonAtom, voicesAtom } from "@/store/atoms";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { avatars as avatarsArray } from "@/lib/constants";
import { Spinner } from "@nextui-org/react";
const AvatarContent = () => {
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [avatars, setAvatars] = useRecoilState<any>(avatarsAtom);
  const [voices, setVoices] = useRecoilState<any>(voicesAtom);
  const [loading, setLoading] = useState(true);

  const fetchAvatarsAndVoices = async () => {
    if (avatars.length > 0 && voices.length > 0) return;
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
      `${heygenBaseUrl}/v1/avatar.list`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
      }
    );
    const filteredAvatars = avatarsData.data.avatars
      .map((item: any) => {
        return { avatar_id: item.avatar_id, ...item.avatar_states[0] };
      })
      .filter((avatar: any) => {
        return avatarsArray.some(
          (avatarItem: any) => avatarItem.id === avatar.id
        );
      });
    console.log(filteredAvatars);
    const filteredVoices = voicesData.data.list.filter(
      (item: any) => item.language === "English"
    );

    const maleAvatars = getFilteredVoiceAndAvatarObjects(
      filteredAvatars,
      "male",
      5
    );
    const femaleAvatars = getFilteredVoiceAndAvatarObjects(
      filteredAvatars,
      "female",
      5
    );
    const selectedAvatars = [...maleAvatars];

    const maleVoices = getFilteredVoiceAndAvatarObjects(
      filteredVoices,
      "male",
      5
    );
    const femaleVoices = getFilteredVoiceAndAvatarObjects(
      filteredVoices,
      "female",
      5
    );
    const selectedVoices = [...maleVoices];

    setAvatars(selectedAvatars || []);
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
  const handleChangeAvatar = (avatar: any) => {
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
      {loading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="label-container">
            <p className="label">Avatars</p>

            <div className="flex flex-wrap items-center gap-4">
              {avatars.map((avatar: any, idx: number) => (
                <div
                  onClick={() => handleChangeAvatar(avatar)}
                  key={idx}
                  className={` flex flex-col items-center gap-2`}
                >
                  <img
                    className={`${
                      currentLesson.content?.avatar_id === avatar.avatar_id
                        ? "border-[2px] border-blue-500"
                        : ""
                    } w-24 h-24 rounded-[20px] object-cover`}
                    src={avatar.normal_thumbnail_medium}
                    alt=""
                  />
                  <p className="text-gray-600">{avatar.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="label-container">
            <p className="label">Voices</p>

            <div className="flex flex-wrap items-center gap-4">
              <AudioButtons />
              <audio
                className="hidden"
                // src={voice}
                id="audio"
                controls
                autoPlay={false}
              />
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
        </>
      )}
    </div>
  );
};

export default AvatarContent;
