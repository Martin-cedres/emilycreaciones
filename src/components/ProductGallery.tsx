"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  imagenes: string[];
  nombre: string;
}

export default function ProductGallery({ imagenes, nombre }: Props) {
  const [selected, setSelected] = useState(0);

  if (imagenes.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-brand-beige flex items-center justify-center text-6xl shadow-inner">
        🪵
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagen Principal con Animación */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-beige shadow-xl border border-pink-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={imagenes[selected]}
              alt={nombre}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                selected === i ? "border-brand-pink scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${nombre} miniatura ${i + 1}`}
                fill
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
