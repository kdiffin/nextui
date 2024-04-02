import type {HTMLAttributes} from "react";

import {FC, forwardRef} from "react";
import {AnimatePresence, HTMLMotionProps, m, LazyMotion, domAnimation} from "framer-motion";
import {HTMLNextUIProps} from "@nextui-org/system";
import {clamp} from "@nextui-org/shared-utils";

import {RippleType} from "./use-ripple";

export interface RippleProps extends HTMLNextUIProps<"span"> {
  ripples: RippleType[];
  color?: string;
  motionProps?: HTMLMotionProps<"span">;
  style?: React.CSSProperties;
  onClear: (key: React.Key) => void;
}

/**
 * Avoid this framer-motion warning:
 * Function components cannot be given refs.
 * Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
 *
 * @see https://www.framer.com/motion/animate-presence/###mode
 */
const PopLayoutWrapper = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  },
);

PopLayoutWrapper.displayName = "NextUI - PopLayoutWrapper";

const Ripple: FC<RippleProps> = (props) => {
  const {ripples = [], motionProps, color = "currentColor", style, onClear} = props;

  return (
    <>
      {ripples.map((ripple) => {
        const duration = clamp(0.01 * ripple.size, 0.2, ripple.size > 100 ? 0.75 : 0.5);

        return (
          <AnimatePresence key={ripple.key} mode="popLayout">
            <PopLayoutWrapper>
              <LazyMotion features={domAnimation}>
                <m.span
                  animate={{transform: "scale(2)", opacity: 0}}
                  className="nextui-ripple"
                  exit={{opacity: 0}}
                  initial={{transform: "scale(0)", opacity: 0.35}}
                  style={{
                    position: "absolute",
                    backgroundColor: color,
                    borderRadius: "100%",
                    transformOrigin: "center",
                    pointerEvents: "none",
                    zIndex: 10,
                    top: ripple.y,
                    left: ripple.x,
                    width: `${ripple.size}px`,
                    height: `${ripple.size}px`,
                    ...style,
                  }}
                  transition={{duration}}
                  onAnimationComplete={() => {
                    onClear(ripple.key);
                  }}
                  {...motionProps}
                />
              </LazyMotion>
            </PopLayoutWrapper>
          </AnimatePresence>
        );
      })}
    </>
  );
};

Ripple.displayName = "NextUI.Ripple";

export default Ripple;
