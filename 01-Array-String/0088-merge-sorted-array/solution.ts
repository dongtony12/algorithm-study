function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    const length = m + n          // ⚠️ 미사용 변수
    let i = m-1
    let j = n-1
    let k = m+n-1

    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k] = nums1[i]
            i--
            k--
        } else {
            nums1[k] = nums2[j]
            j--
            k--
        }
    }
}
