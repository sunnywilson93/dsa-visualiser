import type { Variants, Transition } from 'framer-motion'

// === Entrance animations ===

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

// === Transitions ===

export const entranceTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
}

export const quickTransition: Transition = {
  duration: 0.15,
  ease: 'easeOut',
}

// === Interaction props (spread onto motion elements) ===

export const hoverLift = {
  whileHover: { y: -2 },
  transition: { duration: 0.15 },
} as const

export const tapScale = {
  whileTap: { scale: 0.98 },
} as const
