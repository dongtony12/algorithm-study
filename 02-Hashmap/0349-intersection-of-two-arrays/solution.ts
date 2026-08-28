function intersection(nums1: number[], nums2: number[]): number[] {
    const nums1Set = new Set(nums1)
    const nums2Set = new Set(nums2)

    const intersection = new Set([...nums1Set].filter((x) => nums2Set.has(x)))

    return Array.from(intersection)
}
