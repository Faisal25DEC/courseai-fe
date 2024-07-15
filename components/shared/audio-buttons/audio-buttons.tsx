import React, { useEffect, useState } from "react";
import PlayIcon from "@/assets/icons/PlayIcon";
import PauseIcon from "@/assets/icons/PauseIcon";
import { Button } from "@/components/ui/button";
import { lessonAtom, voicesAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";

const AudioButtons = ({ gender }:any) => {
  const [audioPlaying, setAudioPlaying] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [allVoices] = useRecoilState<any>(voicesAtom);
  const [filteredVoices, setFilteredVoices] = useState<any[]>([]);

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
    const audioElement: any = document.getElementById("audio");
    if (audioElement.getAttribute("src") !== audio) {
      audioElement.setAttribute("src", audio);
    }
    audioElement.play();
  };

  useEffect(() => {
    if (currentLesson?.content?.voice_id) {
      if (!!audioPlaying === true || audioPlaying === 0) {
        playAudioOnButton(filteredVoices[audioPlaying]?.preview?.movio);
      }
    }
  }, [currentLesson?.content?.voice_id, audioPlaying, filteredVoices]);

  const handleChangeVoice = (voice: any, idx: any) => {
    setAudioPlaying(idx);
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        voice: voice || {},
        voice_id: voice?.voice_id || "",
      },
    }));
  };

  useEffect(() => {
    const voices = allVoices.filter(
      (voice: any) => voice.gender?.toLowerCase() === gender?.toLowerCase()
    );
    setFilteredVoices(voices);
  }, [allVoices, gender]);

  return filteredVoices.map((item: any, idx: any) => (
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
            pauseAudio(filteredVoices[idx]?.preview?.movio, idx);
          }}
        >
          <PauseIcon />
        </p>
      ) : (
        <p
          onClick={(e) => {
            e.stopPropagation(); // Stop propagation here
            playAudio(filteredVoices[idx]?.preview?.movio, idx);
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
