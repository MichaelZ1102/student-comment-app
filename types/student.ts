export type Gender = "male" | "female" | "unknown";
export type Tone = "formal" | "warm" | "plain";

export type StudentInput = {
  id: string;
  name: string;
  gender: Gender;
  className: string;
  rawNotes: string;
  tone: Tone;
  extraRequirements?: string;
};

export type GeneratedComment = {
  studentId: string;
  finalComment: string;
  generatedAt: string;
};
