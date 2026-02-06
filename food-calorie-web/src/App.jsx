import React, { useEffect, useMemo, useRef, useState } from 'react';
import UploadButton from './components/UploadButton.jsx';
import FoodCard from './components/FoodCard.jsx';
import Loading from './components/Loading.jsx';

const STRINGS = {
  zh: {
    title: '食物热量识别',
    subtitle: 'AI · Vision · Nutrition',
    takePhoto: '拍照识别',
    uploadImage: '上传图片',
    takePhotoHint: '支持后置摄像头',
    uploadHint: '从相册选择',
    analyzing: '识别中…',
    errorMessage: '识别失败，请重试或换一张清晰照片。',
    permissionDenied: '无法访问摄像头或相册，请在浏览器设置中允许权限。',
    lowToHigh: '按热量从低到高排序',
    recommendedBadge: '最推荐',
    portion: '份量',
    calories: '热量',
    protein: '蛋白质',
    carbs: '碳水',
    fat: '脂肪',
    recommendationTitle: '推荐理由',
    retry: '重新识别',
    closeCamera: '关闭',
    capture: '拍照',
    openCamera: '打开相机',
    noFoods: '未识别到食物，请换一张清晰的照片。',
    themeLight: '浅色',
    themeDark: '深色',
    languageLabel: '语言'
  },
  en: {
    title: 'Food Calorie Scanner',
    subtitle: 'AI · Vision · Nutrition',
    takePhoto: 'Take Photo',
    uploadImage: 'Upload Image',
    takePhotoHint: 'Use rear camera',
    uploadHint: 'Choose from gallery',
    analyzing: 'Analyzing…',
    errorMessage: 'Analysis failed. Please try a clearer photo.',
    permissionDenied: 'Camera or gallery permission denied. Enable it in browser settings.',
    lowToHigh: 'Sorted by calories (low → high)',
    recommendedBadge: 'Top Pick',
    portion: 'Portion',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
    recommendationTitle: 'Why recommended',
    retry: 'Analyze another',
    closeCamera: 'Close',
    capture: 'Capture',
    openCamera: 'Open Camera',
    noFoods: 'No food detected. Try a clearer photo.',
    themeLight: 'Light',
    themeDark: 'Dark',
    languageLabel: 'Language'
  },
  ja: {
    title: '食品カロリー識別',
    subtitle: 'AI · Vision · Nutrition',
    takePhoto: '撮影して解析',
    uploadImage: '画像をアップロード',
    takePhotoHint: '背面カメラ対応',
    uploadHint: 'アルバムから選択',
    analyzing: '解析中…',
    errorMessage: '解析に失敗しました。鮮明な写真で再試行してください。',
    permissionDenied: 'カメラ/写真へのアクセスが許可されていません。',
    lowToHigh: '低カロリー順に並べ替え',
    recommendedBadge: 'おすすめ',
    portion: '分量',
    calories: 'カロリー',
    protein: 'たんぱく質',
    carbs: '炭水化物',
    fat: '脂質',
    recommendationTitle: 'おすすめ理由',
    retry: 'もう一度',
    closeCamera: '閉じる',
    capture: '撮影',
    openCamera: 'カメラを開く',
    noFoods: '食品が見つかりません。より鮮明な写真をお試しください。',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    languageLabel: '言語'
  },
  ko: {
    title: '음식 칼로리 인식',
    subtitle: 'AI · Vision · Nutrition',
    takePhoto: '사진 촬영',
    uploadImage: '이미지 업로드',
    takePhotoHint: '후면 카메라 지원',
    uploadHint: '갤러리에서 선택',
    analyzing: '분석 중…',
    errorMessage: '분석에 실패했습니다. 더 선명한 사진으로 다시 시도하세요.',
    permissionDenied: '카메라/사진 접근이 거부되었습니다.',
    lowToHigh: '저칼로리 순 정렬',
    recommendedBadge: '추천',
    portion: '분량',
    calories: '칼로리',
    protein: '단백질',
    carbs: '탄수화물',
    fat: '지방',
    recommendationTitle: '추천 이유',
    retry: '다시 분석',
    closeCamera: '닫기',
    capture: '촬영',
    openCamera: '카메라 열기',
    noFoods: '음식이 인식되지 않았습니다. 더 선명한 사진을 사용하세요.',
    themeLight: '라이트',
    themeDark: '다크',
    languageLabel: '언어'
  }
};

const normalizeLang = (lang) => {
  if (!lang) return 'zh';
  const value = lang.toLowerCase();
  if (value.startsWith('zh')) return 'zh';
  if (value.startsWith('en')) return 'en';
  if (value.startsWith('ja') || value.startsWith('jp')) return 'ja';
  if (value.startsWith('ko')) return 'ko';
  return 'zh';
};

const sortFoods = (foods) => [...foods].sort((a, b) => a.calories - b.calories);

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const normalizeDataUrl = (dataUrl, mimeType) => {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  if (dataUrl.startsWith('data:')) {
    if (dataUrl.startsWith('data:;base64,') && mimeType) {
      return `data:${mimeType};base64,${dataUrl.split(',')[1] || ''}`;
    }
    return dataUrl;
  }
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  return `data:${mimeType || 'image/jpeg'};base64,${base64}`;
};

const extractBase64 = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  const index = dataUrl.indexOf(',');
  return index === -1 ? dataUrl : dataUrl.slice(index + 1);
};

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const strings = STRINGS[normalizeLang(analysis?.language)] ?? STRINGS.zh;

  const foods = useMemo(() => {
    if (!analysis?.foods) return [];
    return sortFoods(analysis.foods);
  }, [analysis]);

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    try {
      const rawDataUrl = await readFileAsDataUrl(file);
      if (typeof rawDataUrl !== 'string') {
        setError(strings.errorMessage);
        return;
      }
      const mimeType = file.type || 'image/jpeg';
      const dataUrl = normalizeDataUrl(rawDataUrl, mimeType);
      const base64 = extractBase64(dataUrl);
      if (!dataUrl || !base64) {
        setError(strings.errorMessage);
        return;
      }
      await analyzeImage({ dataUrl, mimeType, base64 });
    } catch (err) {
      setError(strings.errorMessage);
    }
  };

  const analyzeImage = async ({ dataUrl, mimeType, base64 }) => {
    const normalizedDataUrl = normalizeDataUrl(dataUrl || base64, mimeType);
    const normalizedBase64 = base64 || extractBase64(normalizedDataUrl);
    if (!normalizedDataUrl || !normalizedBase64) {
      setError(strings.errorMessage);
      return;
    }

    setLoading(true);
    setError('');
    setImagePreview(normalizedDataUrl);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDataUrl: normalizedDataUrl,
          imageBase64: normalizedBase64,
          mimeType: mimeType || 'image/jpeg'
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Request failed');
      }

      const json = await response.json();
      const data = json.data ?? json;

      setAnalysis({
        ...data,
        foods: sortFoods(Array.isArray(data.foods) ? data.foods : [])
      });
    } catch (err) {
      setError(strings.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    setError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOpen(true);
    } catch (err) {
      setError(strings.permissionDenied);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    closeCamera();
    analyzeImage({
      dataUrl,
      mimeType: 'image/jpeg',
      base64: extractBase64(dataUrl)
    });
  };

  const reset = () => {
    setAnalysis(null);
    setImagePreview('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-[-6rem] h-72 w-72 rounded-full bg-brand-200/60 blur-3xl dark:bg-brand-500/30" />
        <div className="pointer-events-none absolute -bottom-32 left-[-4rem] h-72 w-72 rounded-full bg-sunrise-200/70 blur-3xl dark:bg-sunrise-400/30" />

        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
              {strings.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{strings.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-card transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? strings.themeLight : strings.themeDark}
          </button>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">
          {!analysis ? (
            <div className="grid gap-10 rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5 md:grid-cols-[1.1fr_0.9fr]">
              <section>
                <h2 className="font-display text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                  {strings.title}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {strings.lowToHigh}
                </p>
                <div className="mt-8 space-y-4">
                  <UploadButton
                    label={strings.takePhoto}
                    caption={strings.takePhotoHint}
                    onClick={openCamera}
                    variant="primary"
                  />
                  <UploadButton
                    label={strings.uploadImage}
                    caption={strings.uploadHint}
                    onClick={() => uploadInputRef.current?.click()}
                    variant="secondary"
                  />
                </div>

                {error ? (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200">
                    {error}
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">Preview</div>
                <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-900/60">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-white/40">
                      {strings.openCamera}
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5 md:grid-cols-[0.4fr_0.6fr]">
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">Preview</div>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="uploaded"
                      className="h-56 w-full rounded-2xl object-cover"
                    />
                  ) : null}
                  <div className="text-sm text-slate-600 dark:text-white/70">{strings.lowToHigh}</div>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    {strings.lowToHigh}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-white/60">
                    {analysis?.language
                      ? `${strings.languageLabel}: ${analysis.language}`
                      : ''}
                  </p>
                </div>
              </div>

              {foods.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                  {strings.noFoods}
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {foods.map((item, index) => (
                    <FoodCard
                      key={`${item.name}-${index}`}
                      item={item}
                      isRecommended={index === 0}
                      labels={strings}
                    />
                  ))}
                </div>
              )}

              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                <div className="text-sm font-semibold text-brand-600 dark:text-brand-200">
                  {strings.recommendationTitle}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/80">{analysis.recommendation}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <UploadButton
                  label={strings.retry}
                  onClick={reset}
                  variant="secondary"
                />
                <UploadButton
                  label={strings.uploadImage}
                  onClick={() => uploadInputRef.current?.click()}
                  variant="primary"
                />
              </div>
            </div>
          )}
        </main>

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>

      {cameraOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {strings.openCamera}
              </h3>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
              >
                {strings.closeCamera}
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              <video ref={videoRef} autoPlay playsInline className="h-[360px] w-full object-cover" />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={capturePhoto}
                className="rounded-full bg-brand-500 px-6 py-2 text-sm font-semibold text-white"
              >
                {strings.capture}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {loading ? <Loading label={strings.analyzing} /> : null}
    </div>
  );
}
