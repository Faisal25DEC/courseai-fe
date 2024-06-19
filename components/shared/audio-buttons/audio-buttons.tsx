import React, { useEffect, useState } from "react";
import PlayIcon from "@/assets/icons/PlayIcon";
import PauseIcon from "@/assets/icons/PauseIcon";
import { Button } from "@/components/ui/button";
import { lessonAtom, voicesAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";

const AudioButtons = ({}) => {
  const [audioPlaying, setAudioPlaying] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [voices, setVoices] = useRecoilState<any>(voicesAtom);
  const playAudio = (audio: any, idx: any) => {
    playAudioOnButton(audio);
    setAudioPlaying(idx);
  };
  const pauseAudio = (audio: any, idx: any) => {
    const audioElement: any = document.getElementById("audio");
    if (!audioElement) return;
    audioElement.pause();
    setAudioPlaying(null);
  };
  const playAudioOnButton = (audio: any) => {
    console.log("playAudio");
    const audioElement: any = document.getElementById("audio");
    if (audioElement.getAttribute("src") !== audio) {
      audioElement.setAttribute("src", audio);
    }
    audioElement.play();
  };

  useEffect(() => {
    if (currentLesson?.content?.voice_id) {
      console.log(audioPlaying);
      if (!!audioPlaying === true || audioPlaying === 0) {
        playAudioOnButton(voices[audioPlaying]?.preview?.movio);
      }
    }
  }, [currentLesson?.content?.voice_id, audioPlaying]);
  const handleChangeVoice = (voide: any, idx: any) => {
    setAudioPlaying(idx);
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        voice: voide || {},
        voice_id: voide?.voice_id || "",
      },
    }));
  };
  console.log(audioPlaying);
  return voices.map((item: any, idx: any) => (
    <Button
      className="flex items-center gap-2"
      onClick={(e: any) => {
        e.stopPropagation(); // This stops the click from propagating to child elements
        handleChangeVoice(item, idx);
      }}
      variant={
        currentLesson.content?.voice_id === item.voice_id
          ? "default"
          : "outline"
      }
      key={idx}
    >
      {audioPlaying === idx ? (
        <p
          onClick={(e) => {
            e.stopPropagation(); // Stop propagation here
            pauseAudio(voices[idx]?.preview?.movio, idx);
          }}
        >
          <PauseIcon />
        </p>
      ) : (
        <p
          onClick={(e) => {
            e.stopPropagation(); // Stop propagation here
            playAudio(voices[idx]?.preview?.movio, idx);
          }}
        >
          <PlayIcon />
        </p>
      )}
      {item.display_name}
    </Button>
  ));
};

export default AudioButtons;
