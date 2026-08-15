import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sunrise,
  Anchor,
  CalendarDays,
  Wind,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Play,
  Square,
  Search,
  Sparkles,
} from "lucide-react";

const MOODS = [
  { key: "tough", label: "Really tough", color: "#FF9166", level: 1 },
  { key: "low", label: "Low", color: "#FFC857", level: 2 },
  { key: "okay", label: "Okay", color: "#B8A6FF", level: 3 },
  { key: "good", label: "Good", color: "#4FD1C5", level: 4 },
  { key: "great", label: "Great", color: "#7CE3B0", level: 5 },
];

const CATEGORY_COLOR = {
  "Cognitive (CBT)": "#FF7A6B",
  "Mindfulness & DBT": "#4FD1C5",
  "Self-care": "#FFC857",
};

const MILESTONES = [3, 7, 14, 30, 60, 100];
