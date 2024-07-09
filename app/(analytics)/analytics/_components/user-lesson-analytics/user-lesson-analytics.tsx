import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import { StringFormats } from "@/lib/StringFormats";
import {
  analyticsTabValueAtom,
  currentAvatarConversationAtom,
  currentCourseAtom,
  currentUserLessonAnalyticsAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { textColorBasedOnStatus } from "./constants";
import ApprovalPending from "./_legos/approval-pending/approval-pending";
import {
  analyticsTabsValues,
  lessonStatuses,
  lessonStatusText,
} from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllCourses } from "@/services/lesson.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import axios from "axios";
import { baseUrl } from "@/lib/config";

const UserLessonAnalytics = () => {
  const [currentAvatarConversation, setCurrentAvatarConversation] =
    useRecoilState(currentAvatarConversationAtom);
  const [tabValue, setTabValue] = useRecoilState(analyticsTabValueAtom);
  const { approvalPending, approved, pending } = lessonStatuses;
  const [lessonsArray, setLessonsArray] = useRecoilState(lessonsArrayAtom);
  const [currentUserLessonAnalytics, setCurrentUserLessonAnalytics] =
    useRecoilState(currentUserLessonAnalyticsAtom);
  const [isPractice, setIsPractice] = useState(false);
  const [isCourseSelected, setisCourseSelected] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [currentCourseId, setCurrentCourseId] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("courses"); // New state to track selected tab

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res);
        console.log("all courses", res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentCourse();
  }, []);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      if (currentCourseId) {
        try {
          const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
          setCurrentCourse(res.data);
          setLessonsArray(res.data.lessons);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchCurrentCourse();

    return () => {
      setLessonsArray([]);
    };
  }, [currentCourseId, setCurrentCourse, setLessonsArray]);

  console.log("lessonsArray ", lessonsArray);

  const getUserLessonAnalyticsArray = (
    currentUserAnalytics: any,
    lessonsArray: any
  ) => {
    let lessonAnalyticsArrayAns: any = [];
    lessonsArray.forEach((lesson: any) => {
      lessonAnalyticsArrayAns.push({
        ...lesson,
        ...currentUserAnalytics.analytics?.[lesson.id],
      });
    });
    return lessonAnalyticsArrayAns;
  };

  const lessonAnalyticsArray = getUserLessonAnalyticsArray(
    currentUserLessonAnalytics,
    lessonsArray
  );

  const getRecordingsCount = (lesson: any) => {
    if (lesson?.type !== "avatar") {
      return "-";
    }
    return lesson?.conversations?.length > 0
      ? `${lesson?.conversations?.length} recordings`
      : "No recordings";
  };

  const viewRecordings = (lesson: any) => {
    if (lesson?.type !== "avatar") {
      return null;
    }

    setCurrentAvatarConversation(lesson?.conversations);
    setTabValue(analyticsTabsValues.avatarConversations);
  };

  const getClassNames = (lesson: any) => {
    if (lesson?.type !== "avatar") {
      return "text-gray-400";
    }
    return "text-blue-600 underline font-light";
  };

  const headings = [
    "Lesson",
    "Status",
    "Time Spent",
    "Completed At",
    "Recordings",
  ];

  return (
    <div className="min-h-[80vh] h-[80vh] min-w-[990px] z-40 overflow-auto">
      <div className="flex items-center gap-4 p-4">
        <div>
          <img
            src={currentUserLessonAnalytics?.imageUrl}
            className="w-[40px] h-[40px] object-cover rounded-full"
          />
        </div>
        <div>
          <p className="text-lg font-normal text-gray-700">
            {currentUserLessonAnalytics?.firstName}{" "}
            {currentUserLessonAnalytics?.lastName}&apos;s Analytics
          </p>
        </div>
      </div>
      <hr />
      <Breadcrumbs className="px-5 pt-5">
        <BreadcrumbItem
          onClick={() => {
            setisCourseSelected(false);
            setSelectedTab("courses"); // Reset tab to "Courses"
          }}
        >
          Courses
        </BreadcrumbItem>
        <BreadcrumbItem>Analytics</BreadcrumbItem>
      </Breadcrumbs>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        {!isCourseSelected  &&
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="practice-lessons">Practice Lessons</TabsTrigger>
        </TabsList>
}
        <TabsContent value="courses">
          {!isCourseSelected && (
            <div>
              <h1 className="px-5 py-5 font-semibold text-sm">Choose Course</h1>
              
              {courses.map((cr: any) => {
                return (
                  <div
                    key={cr.id}
                    className="text-sm hover:bg-gray-100 cursor-pointer mb-5 mx-5 py-2 px-2 border-1 border-gray-300 rounded-lg flex items-center justify-between"
                    onClick={() => {
                      setCurrentCourseId(cr.id);
                      setisCourseSelected(true);
                    }}
                  >
                    <p className="text-sm">{cr.title}</p>
                    <Icon icon="teenyicons:right-outline" />
                  </div>
                );
              })}
            </div>
          )}
          {isCourseSelected && (
            <div className="h-[70vh] overflow-y-scroll rounded-[20px]">
              <div className="flex justify-between items-center py-4 px-6 text-sm font-normal">
                {headings.map((heading) => {
                  return (
                    <div key={heading} className="w-[25%]">
                      <p>{heading}</p>
                    </div>
                  );
                })}
              </div>
              {lessonAnalyticsArray
                .filter((lesson: any) => lesson.is_practice_lesson === false)
                .map((lesson: any) => {
                  return (
                    <div
                      onClick={() => {
                        viewRecordings(lesson);
                      }}
                      key={lesson.id}
                      className={`py-4 px-6 border-b border-gray-200 rounded-b-[20px] ${
                        lesson?.type === "avatar" && "cursor-pointer"
                      } flex justify-between items-center rounded-md`}
                    >
                      <div className="flex-1 text-[13px]">
                        <p>{lesson.title?.slice(0, 28)}</p>
                      </div>
                      <div className="flex-1">
                        <p
                          className={`${
                            textColorBasedOnStatus[lesson.status || "pending"]
                          } text-[13px]`}
                        >
                          {lesson?.status === approvalPending && (
                            <ApprovalPending lesson={lesson} />
                          )}
                          {lesson?.status !== approvalPending &&
                            (StringFormats.capitalizeFirstLetterOfEachWord(
                              lessonStatusText[lesson?.status]
                            ) ||
                              "Incomplete")}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px]">
                          {FormatDate.formatMilliseconds(lesson.duration) ===
                          "0 seconds"
                            ? "Less Than A Second"
                            : FormatDate.formatMilliseconds(lesson.duration) ||
                              "-"}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px]">
                          {lesson.completed_at
                            ? FormatDate.getDateAndTimeFromMilliseconds(
                                lesson.completed_at
                              )
                            : "Yet to Start"}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p
                          onClick={() => {
                            viewRecordings(lesson);
                          }}
                          className={`text-[13px] ${getClassNames(lesson)}`}
                        >
                          {getRecordingsCount(lesson)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="practice-lessons">
          <div className="h-[70vh] overflow-y-scroll rounded-[20px]">
            <div className="flex justify-between items-center py-4 px-6 text-sm font-normal">
              {headings.map((heading) => {
                return (
                  <div key={heading} className="w-[25%]">
                    <p>{heading}</p>
                  </div>
                );
              })}
            </div>
            {lessonAnalyticsArray
              .filter((lesson: any) => lesson.is_practice_lesson === true)
              .map((lesson: any) => {
                return (
                  <div
                    onClick={() => {
                      viewRecordings(lesson);
                    }}
                    key={lesson.id}
                    className={`py-4 px-6 border-b border-gray-200 rounded-b-[20px] ${
                      lesson?.type === "avatar" && "cursor-pointer"
                    } flex justify-between items-center rounded-md`}
                  >
                    <div className="flex-1 text-[13px]">
                      <p>{lesson.title?.slice(0, 28)}</p>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`${
                          textColorBasedOnStatus[lesson.status || "pending"]
                        } text-[13px]`}
                      >
                        {lesson?.status === approvalPending && (
                          <ApprovalPending lesson={lesson} />
                        )}
                        {lesson?.status !== approvalPending &&
                          (StringFormats.capitalizeFirstLetterOfEachWord(
                            lessonStatusText[lesson?.status]
                          ) || "Incomplete")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px]">
                        {FormatDate.formatMilliseconds(lesson.duration) ===
                        "0 seconds"
                          ? "Less Than A Second"
                          : FormatDate.formatMilliseconds(lesson.duration) ||
                            "-"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px]">
                        {lesson.completed_at
                          ? FormatDate.getDateAndTimeFromMilliseconds(
                              lesson.completed_at
                            )
                          : "Yet to Start"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p
                        onClick={() => {
                          viewRecordings(lesson);
                        }}
                        className={`text-[13px] ${getClassNames(lesson)}`}
                      >
                        {getRecordingsCount(lesson)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserLessonAnalytics;
