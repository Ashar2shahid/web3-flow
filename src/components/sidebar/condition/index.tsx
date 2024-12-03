import {
  X,
  Copy,
  Unlock,
  Lock,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import type {
  Classnames,
  Controls,
  FullField,
  Translations,
} from "react-querybuilder";
import { getCompatContextProvider } from "react-querybuilder";
import { ShadcnUiActionElement } from "./ActionElement";
import { ShadcnUiActionElementIcon } from "./ShadcnUiActionElementIcon";
import { ShadcnUiValueEditor } from "./ShadcnUiValueEditor";
import { ShadcnUiValueSelector } from "./ShadcnUiValueSelector";
import { ShadcnUiDragHandle } from "./ShadcnUiDragHandle";

import "./styles.css";

export * from "./ActionElement";
export * from "./ShadcnUiValueSelector";

export const shadcnUiControlClassnames = {
  ruleGroup: "rounded-lg shadow-sm border bg-background px-3 py-3 flex flex-col gap-4",
} satisfies Partial<Classnames>;

export const shadcnUiControlElements = {
  actionElement: ShadcnUiActionElement,
  removeRuleAction: ShadcnUiActionElementIcon,
  valueSelector: ShadcnUiValueSelector,
  valueEditor: ShadcnUiValueEditor,
  dragHandle: ShadcnUiDragHandle,
  // Do not define addGroupAction to remove the Group button
} satisfies Partial<Controls<FullField, string>>;

export const shadcnUiTranslations = {
  addRule: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Rule
      </>
    ),
  },
  // Remove the addGroup translation
  removeGroup: { label: <X className="w-4 h-4" /> },
  removeRule: { label: <X className="w-4 h-4" /> },
} satisfies Partial<Translations>;

export const QueryBuilderShadcnUi = getCompatContextProvider({
  key: "shadcn/ui",
  controlClassnames: shadcnUiControlClassnames,
  controlElements: shadcnUiControlElements,
  translations: shadcnUiTranslations,
});