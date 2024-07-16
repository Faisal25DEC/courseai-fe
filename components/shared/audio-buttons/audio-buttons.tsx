import React, { useEffect, useState } from "react";
import PlayIcon from "@/assets/icons/PlayIcon";
import PauseIcon from "@/assets/icons/PauseIcon";
import { Button } from "@/components/ui/button";
import { lessonAtom, playingAudioIndexAtom, voicesAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";

const AudioButtons = ({ gender }: any) => {
  const [audioPlaying, setAudioPlaying] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [allVoices] = useRecoilState<any>(voicesAtom);
  const [filteredVoices, setFilteredVoices] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showAll, setShowAll] = useState(false);
  const [currentSelectedButton, setcurrentSelectedButton] = useRecoilState<any>(
    playingAudioIndexAtom
  );
  const playAudio = (audio: any, idx: any) => {
    const audioElement: any = document.getElementById("audio");
    if (audioElement.getAttribute("src") !== audio) {
      audioElement.setAttribute("src", audio);
    }
    audioElement.play();
    setAudioPlaying(idx);
  };

  const pauseAudio = () => {
    const audioElement: any = document.getElementById("audio");
    audioElement.pause();
    setAudioPlaying(null);
  };

  useEffect(() => {
    setcurrentSelectedButton(0)
    const audioElement: any = document.getElementById("audio");
    const handleEnded = () => setAudioPlaying(null);

    audioElement.addEventListener("ended", handleEnded);
    return () => {
      audioElement.removeEventListener("ended", handleEnded);
      setcurrentSelectedButton(null)
    };
  }, []);

  useEffect(() => {
    if (currentLesson?.content?.voice_id) {
      if (audioPlaying !== null) {
        playAudio(filteredVoices[audioPlaying]?.preview?.movio, audioPlaying);
      }
    }
  }, [currentLesson?.content?.voice_id, audioPlaying, filteredVoices]);

  const handleChangeVoice = (voice: any, idx: any) => {
    setcurrentSelectedButton(idx);
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        voice: voice || {},
        voice_id: voice?.voice_id || "",
      },
    }));
    setAudioPlaying(idx);
  };

  useEffect(() => {
    const voices = allVoices.filter(
      (voice: any) => voice.gender?.toLowerCase() === gender?.toLowerCase()
    );
    setFilteredVoices(voices);
  }, [allVoices, gender]);

  const handleShowMore = () => {
    setVisibleCount(filteredVoices.length);
    setShowAll(true);
  };

  const handleShowLess = () => {
    setVisibleCount(8); // Reset to initial count
    setShowAll(false);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {filteredVoices.slice(0, visibleCount).map((item: any, idx: any) => (
        <Button
          className="flex items-center gap-2"
          onClick={(e: any) => {
            e.stopPropagation();
            if (audioPlaying === idx) {
              pauseAudio();
            } else {
              handleChangeVoice(item, idx);
            }
          }}
          variant={
            currentSelectedButton === idx ? "default" : "outline"
          }
          key={idx}
        >
          {audioPlaying === idx ? (
            <p>
              <PauseIcon />
            </p>
          ) : (
            <p>
              <PlayIcon />
            </p>
          )}
          {item.display_name}
        </Button>
      ))}
      <div className="col-span-4 flex justify-end">
        {!showAll && visibleCount < filteredVoices.length && (
          <Button onClick={handleShowMore} variant="outline">
            Show More...
          </Button>
        )}
        {showAll && (
          <Button onClick={handleShowLess} variant="outline">
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioButtons;
