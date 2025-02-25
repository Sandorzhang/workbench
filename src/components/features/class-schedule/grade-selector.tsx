'use client'

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select"

interface GradeSelectorProps {
  value: string
  onChange: (value: string) => void
}

// 模拟年级数据
const GRADES = [
  { id: 'G1', name: '一年级' },
  { id: 'G2', name: '二年级' },
  { id: 'G3', name: '三年级' },
  { id: 'G4', name: '四年级' },
  { id: 'G5', name: '五年级' },
  { id: 'G6', name: '六年级' },
]

export function GradeSelector({ value, onChange }: GradeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="选择年级" />
      </SelectTrigger>
      <SelectContent>
        {GRADES.map(grade => (
          <SelectItem key={grade.id} value={grade.id}>
            {grade.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 