import { useState, useEffect } from 'react';
import { tasksDatabase } from './tasks/index.js';

const Icons = {
  Logo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      <path d="M8 7h8"/><path d="M8 11h8"/>
    </svg>
  ),
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  BarChart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Printer: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Info: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTest, setCurrentTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [stats, setStats] = useState([]);
  const [variantId, setVariantId] = useState('');
  const [selectedBankTask, setSelectedBankTask] = useState(null);
  const [bankAnswers, setBankAnswers] = useState({});
  const [bankResults, setBankResults] = useState({});

  useEffect(() => {
    const savedStats = localStorage.getItem('rusege_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    localStorage.setItem('rusege_stats', JSON.stringify(stats));
  }, [stats]);

  const generateTest = () => {
    const newTest = [];
    for (let i = 1; i <= 26; i++) {
      const variants = tasksDatabase[i];
      if (variants && variants.length > 0) {
        const randomTask = variants[Math.floor(Math.random() * variants.length)];
        newTest.push({ num: i, originalNum: i, ...randomTask });
      } else {
        newTest.push({
          num: i, originalNum: i, id: 'mock-' + i,
          text: 'Текст задания №' + i + ' находится в разработке...',
          answer: '1', explanation: 'Разбор появится позже.'
        });
      }
    }
    setVariantId(Math.floor(1000 + Math.random() * 9000));
    setCurrentTest(newTest);
    setUserAnswers({});
    setTestResults(null);
    setActiveTab('test');
  };

  const checkTest = () => {
    let correctCount = 0;
    const results = {};
    currentTest.forEach(task => {
      const userAnswer = (userAnswers[task.id] || '').trim().toLowerCase();
      const isCorrect = userAnswer === task.answer.toLowerCase();
      if (isCorrect) correctCount++;
      results[task.id] = isCorrect;
    });
    setTestResults({ score: correctCount, total: currentTest.length, details: results });
    setStats(prev => [{
      date: new Date().toLocaleString('ru-RU'),
      variant: variantId,
      score: correctCount,
      total: currentTest.length
    }, ...prev]);
  };

  const handleBankAnswerCheck = (taskId, correctAnswer) => {
    const uAns = (bankAnswers[taskId] || '').trim().toLowerCase();
    const isCorrect = uAns === correctAnswer.toLowerCase();
    setBankResults(prev => ({ ...prev, [taskId]: isCorrect }));
  };

  const getTaskCount = (num) => {
    const tasks = tasksDatabase[num];
    return tasks ? tasks.length : 0;
  };

  const currentDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (activeTab === 'print_preview') {
    return (
      <div className="bg-gray-200 min-h-screen relative pb-20 print:bg-white print:pb-0">
        <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-50 print:hidden shadow-lg">
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('test')} className="flex items-center text-slate-300 hover:text-white transition">
              <Icons.ArrowLeft /> <span className="ml-2 font-medium">Вернуться</span>
            </button>
            <div className="h-6 w-px bg-slate-600"></div>
            <span className="font-semibold text-lg">Режим печати</span>
          </div>
          <div className="flex space-x-3 items-center">
            <span className="hidden sm:inline text-sm text-slate-300">Нажмите Ctrl+P или кнопку:</span>
            <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold flex items-center shadow-md transition-colors">
              <Icons.Printer /> <span className="ml-2">Скачать PDF</span>
            </button>
          </div>
        </div>

        <style>{`
          @media print {
            @page { margin: 15mm; size: A4; }
            body { font-family: "Times New Roman", Times, serif; background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page-break { break-after: page; }
          }
          .a4-page {
            width: 210mm; min-height: 297mm; background: white; margin: 0 auto; margin-top: 80px; margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 12mm 15mm; position: relative;
            color: black; font-family: "Times New Roman", Times, serif; font-size: 13pt; line-height: 1.5;
          }
          @media print {
            .a4-page { margin: 0; box-shadow: none; min-height: auto; padding: 25mm 20mm; width: 100%; page-break-after: always; }
            .a4-page:last-child { page-break-after: auto; }
          }
        `}</style>

        {currentTest && (
          <div className="pt-4">
            <div className="a4-page flex flex-col items-center justify-center" style={{minHeight: '297mm'}}>
              <div className="absolute top-8 left-10 right-10 flex justify-between text-[10pt] text-gray-500">
                <span>РусЕГЭ</span>
                <span>{currentDate}</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <h1 style={{fontSize: '24pt', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center'}}>ЕДИНЫЙ ГОСУДАРСТВЕННЫЙ ЭКЗАМЕН</h1>
                <h2 style={{fontSize: '18pt', marginBottom: '48px', textAlign: 'center', textTransform: 'uppercase'}}>ПО РУССКОМУ ЯЗЫКУ</h2>
                <div style={{fontSize: '16pt', border: '3px solid black', padding: '16px 36px', fontWeight: 'bold', letterSpacing: '2px'}}>
                  Вариант RUSEGE-{variantId}
                </div>
              </div>
              <div style={{textAlign: 'center', color: '#666', marginTop: 'auto'}}>
                <p>rusege.ru</p>
                <p style={{marginTop: '8px', fontWeight: 'bold'}}>Стр. 1</p>
              </div>
            </div>

            <div className="a4-page">
              <div style={{position: 'absolute', top: '8px', right: '20px', fontSize: '10pt', color: '#999'}}>Стр. 2</div>
              <h3 style={{fontWeight: 'bold', textAlign: 'center', fontSize: '16pt', marginBottom: '24px', marginTop: '20px', textTransform: 'uppercase'}}>Инструкция по выполнению работы</h3>
              <div style={{fontSize: '12pt', lineHeight: '1.6', textAlign: 'justify'}}>
                <p style={{textIndent: '20px', marginBottom: '12px'}}>На выполнение экзаменационной работы по русскому языку отводится 3 часа 30 минут (210 минут). Работа состоит из двух частей, включающих 27 заданий.</p>
                <p style={{textIndent: '20px', marginBottom: '12px'}}>Часть 1 содержит 26 заданий с кратким ответом. Ответы к заданиям 1–26 записываются в виде цифры (числа) или слова (нескольких слов), последовательности цифр (чисел) без пробелов, запятых и других дополнительных символов.</p>
                <p style={{textIndent: '20px', marginBottom: '12px'}}>Часть 2 содержит 1 задание с развёрнутым ответом (сочинение).</p>
                <p style={{textIndent: '20px', marginBottom: '12px'}}>Все бланки заполняются яркими чёрными чернилами. При выполнении заданий можно пользоваться черновиком.</p>
              </div>
              <div style={{marginTop: '32px', border: '2px solid black', padding: '16px', textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold', fontSize: '16px'}}>
                Желаем успеха!
              </div>
            </div>

            <div className="a4-page">
              <div style={{position: 'absolute', top: '8px', right: '20px', fontSize: '10pt', color: '#999'}}>Стр. 3</div>
              <h3 style={{fontWeight: 'bold', textAlign: 'center', fontSize: '16pt', marginBottom: '20px', marginTop: '16px', textTransform: 'uppercase'}}>Часть 1</h3>
              <div style={{fontSize: '12pt', lineHeight: '1.5'}}>
                {currentTest.slice(0, 13).map((task, idx) => (
                  <div key={task.id} style={{marginBottom: '16px', pageBreakInside: 'avoid'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <div style={{fontWeight: 'bold', fontSize: '13pt', minWidth: '24px'}}>{task.num}.</div>
                      <div style={{flex: 1, whiteSpace: 'pre-wrap'}}>{task.text}</div>
                    </div>
                    <div style={{marginTop: '8px', fontStyle: 'italic', color: '#555'}}>Ответ: _____________________</div>
                    {idx < 12 && <hr style={{marginTop: '8px', border: 'none', borderTop: '1px solid #ccc'}} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="a4-page">
              <div style={{position: 'absolute', top: '8px', right: '20px', fontSize: '10pt', color: '#999'}}>Стр. 4</div>
              <div style={{fontSize: '12pt', lineHeight: '1.5', marginTop: '16px'}}>
                {currentTest.slice(13, 26).map((task) => (
                  <div key={task.id} style={{marginBottom: '16px', pageBreakInside: 'avoid'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <div style={{fontWeight: 'bold', fontSize: '13pt', minWidth: '24px'}}>{task.num}.</div>
                      <div style={{flex: 1, whiteSpace: 'pre-wrap'}}>{task.text}</div>
                    </div>
                    <div style={{marginTop: '8px', fontStyle: 'italic', color: '#555'}}>Ответ: _____________________</div>
                    <hr style={{marginTop: '8px', border: 'none', borderTop: '1px solid #ccc'}} />
                  </div>
                ))}
              </div>
              <div style={{marginTop: '32px', borderTop: '2px solid black', paddingTop: '16px'}}>
                <h3 style={{fontWeight: 'bold', textAlign: 'center', fontSize: '14pt', marginBottom: '8px', textTransform: 'uppercase'}}>Часть 2</h3>
                <p style={{fontWeight: 'bold', marginBottom: '8px'}}>Задание 27.</p>
                <p style={{fontSize: '12pt'}}>Напишите сочинение по прочитанному тексту. Сформулируйте одну из проблем, поставленных автором текста. Объём сочинения – не менее 150 слов.</p>
              </div>
            </div>

            <div className="a4-page">
              <div style={{position: 'absolute', top: '8px', right: '20px', fontSize: '10pt', color: '#999'}}>Стр. 5</div>
              <h3 style={{fontWeight: 'bold', textAlign: 'center', fontSize: '18pt', marginBottom: '24px', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '3px'}}>Бланк ответов №1</h3>
              <div style={{border: '3px solid black', padding: '16px', marginBottom: '24px', backgroundColor: '#fafafa'}}>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '12px'}}>
                  <div style={{borderBottom: '1px solid black', flex: 1, minWidth: '200px', display: 'flex'}}><span style={{fontWeight: 'bold', minWidth: '80px'}}>Регион:</span><span style={{flex: 1}}></span></div>
                  <div style={{borderBottom: '1px solid black', flex: 1, minWidth: '200px', display: 'flex'}}><span style={{fontWeight: 'bold', minWidth: '80px'}}>Код ППЭ:</span><span style={{flex: 1}}></span></div>
                  <div style={{borderBottom: '1px solid black', flex: 1, minWidth: '200px', display: 'flex'}}><span style={{fontWeight: 'bold', minWidth: '80px'}}>Предмет:</span><span style={{textTransform: 'uppercase', letterSpacing: '2px'}}>Русский язык</span></div>
                  <div style={{borderBottom: '1px solid black', flex: 1, minWidth: '200px', display: 'flex'}}><span style={{fontWeight: 'bold', minWidth: '80px'}}>Вариант:</span><span style={{fontWeight: 'bold'}}>RUSEGE-{variantId}</span></div>
                </div>
              </div>
              <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '14pt', marginBottom: '20px', textTransform: 'uppercase'}}>Результаты выполнения заданий (Часть 1)</p>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px'}}>
                {currentTest.map((task) => (
                  <div key={'blank-' + task.num} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{fontWeight: 'bold', fontSize: '12pt', textAlign: 'right', minWidth: '24px'}}>{task.num}</div>
                    <div style={{flex: 1, display: 'flex', gap: '1px'}}>
                      {Array.from({length: 17}).map((_, i) => (
                        <div key={i} style={{width: '16px', height: '22px', border: '1px solid black', flexShrink: 0}}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="a4-page" style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{position: 'absolute', top: '8px', right: '20px', fontSize: '10pt', color: '#999'}}>Стр. 6</div>
              <h3 style={{fontWeight: 'bold', textAlign: 'center', fontSize: '18pt', marginBottom: '8px', marginTop: '16px', textTransform: 'uppercase'}}>Бланк ответов №2</h3>
              <p style={{textAlign: 'center', fontStyle: 'italic', color: '#666', marginBottom: '20px'}}>Для задания с развёрнутым ответом (Задание 27)</p>
              <div style={{flex: 1, border: '2px solid black', backgroundImage: 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)', backgroundSize: '20px 20px', minHeight: '200mm'}}></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center rounded-xl mr-3 shadow-md">
                <Icons.Logo />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">РусЕГЭ</span>
            </div>
            <div className="flex space-x-1 sm:space-x-2 items-center overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('home')} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icons.Home /> <span className="hidden sm:inline ml-2">Главная</span>
              </button>
              <button onClick={() => setActiveTab('bank')} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${activeTab === 'bank' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icons.Book /> <span className="hidden sm:inline ml-2">Банк заданий</span>
              </button>
              {currentTest && (
                <button onClick={() => setActiveTab('test')} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${activeTab === 'test' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icons.Play /> <span className="hidden sm:inline ml-2">Вариант</span>
                </button>
              )}
              <button onClick={() => setActiveTab('stats')} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${activeTab === 'stats' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icons.BarChart /> <span className="hidden sm:inline ml-2">Статистика</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center animate-fade-in relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Твой тренажёр для ЕГЭ по русскому языку</h1>
              <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                Полноценные варианты из 26 заданий, подробный разбор ошибок, банк заданий для точечной тренировки и генерация PDF с бланками для печати.
              </p>
              <p className="text-sm text-slate-400 mb-6">В базе: задания всех типов (1–26)</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={generateTest} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center text-lg">
                  <Icons.Play /> <span className="ml-2">Сгенерировать вариант</span>
                </button>
                <button onClick={() => setActiveTab('bank')} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center text-lg">
                  <Icons.Book /> <span className="ml-2">Решать по темам</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'test' && currentTest && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-800 p-3 rounded-xl"><Icons.Play /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Вариант RUSEGE-{variantId}</h2>
                  <p className="text-sm font-medium text-slate-500">Заданий: {currentTest.length}</p>
                </div>
              </div>
              <button onClick={() => setActiveTab('print_preview')} className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow-md transition-all">
                <Icons.Printer /> <span className="ml-2">Версия для печати (PDF)</span>
              </button>
            </div>

            {testResults && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-8 rounded-2xl mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-green-900 mb-2">Ваш результат: {testResults.score} из {testResults.total}</h3>
                  <p className="text-green-700 font-medium">Внимательно изучите разбор ошибок к каждому заданию.</p>
                </div>
                <div className="text-6xl font-black text-green-600 bg-white p-6 rounded-2xl shadow-sm">
                  {Math.round((testResults.score / testResults.total) * 100)}<span className="text-3xl text-green-400">%</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {currentTest.map((task) => {
                const wasChecked = testResults && testResults.details[task.id] !== undefined;
                const isCorrect = wasChecked && testResults.details[task.id];
                return (
                <div key={task.id} className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border transition-colors ${testResults ? (isCorrect ? 'border-green-300' : 'border-red-300') : 'border-slate-200 hover:border-blue-300'}`}>
                  <div className="flex gap-4 sm:gap-6">
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg ${wasChecked ? (isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-slate-100 text-slate-700'}`}>
                      {task.num}
                    </div>
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap text-slate-800 text-[15px] sm:text-base leading-relaxed mb-6 font-medium">{task.text}</p>
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider hidden sm:block">Ответ:</span>
                        <input
                          type="text"
                          placeholder="Введите ответ без пробелов..."
                          value={userAnswers[task.id] || ''}
                          onChange={(e) => setUserAnswers(prev => ({ ...prev, [task.id]: e.target.value }))}
                          disabled={!!testResults}
                          className={`flex-1 max-w-sm px-4 py-3 rounded-lg border font-medium ${wasChecked ? (isCorrect ? 'border-green-400 bg-green-50 text-green-900' : 'border-red-400 bg-red-50 text-red-900') : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} outline-none transition-colors shadow-inner`}
                        />
                        {wasChecked && (
                          <div className="flex items-center">
                            {isCorrect ? (
                              <span className="flex items-center text-green-600 font-bold bg-green-100 px-3 py-2 rounded-lg"><Icons.CheckCircle /> <span className="ml-2">Верно</span></span>
                            ) : (
                              <span className="flex items-center text-red-600 font-bold bg-red-100 px-3 py-2 rounded-lg"><Icons.XCircle /> <span className="ml-2">Ответ: {task.answer}</span></span>
                            )}
                          </div>
                        )}
                      </div>
                      {wasChecked && task.explanation && (
                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-5 text-blue-900 text-sm">
                          <div className="flex items-center gap-2 font-bold mb-2"><Icons.Info /> Разбор:</div>
                          <p className="leading-relaxed">{task.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {!testResults && (
              <div className="mt-10 flex justify-end">
                <button onClick={checkTest} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-600/30 transition-all text-xl">
                  Завершить и проверить
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
            <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-fit md:sticky md:top-24">
              <h3 className="font-bold text-lg text-slate-800 mb-4 px-2">Выберите задание:</h3>
              <div className="grid grid-cols-4 md:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                {Array.from({length: 26}).map((_, i) => {
                  const num = i + 1;
                  const count = getTaskCount(num);
                  return (
                    <button key={num} onClick={() => { setSelectedBankTask(num); setBankAnswers({}); setBankResults({}); }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${selectedBankTask === num ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700'}`}
                    >
                      <span className="font-bold text-lg">{num}</span>
                      <span className={`text-xs ${selectedBankTask === num ? 'text-indigo-200' : 'text-slate-400'}`}>{count > 0 ? count + ' шт.' : '—'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1">
              {!selectedBankTask ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center text-slate-500">
                  <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-400"><Icons.Book /></div>
                  <h2 className="text-xl font-bold text-slate-700 mb-2">Банк заданий ЕГЭ</h2>
                  <p>Выберите номер задания в меню слева, чтобы начать точечную тренировку.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">{selectedBankTask}</div>
                    <h2 className="text-2xl font-bold text-indigo-900">Задание №{selectedBankTask}</h2>
                    <span className="text-indigo-500 font-medium">{getTaskCount(selectedBankTask)} заданий</span>
                  </div>

                  {(!tasksDatabase[selectedBankTask] || tasksDatabase[selectedBankTask].length === 0) ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Задания этого типа скоро будут добавлены.</div>
                  ) : (
                    tasksDatabase[selectedBankTask].map((task) => {
                      const isChecked = bankResults[task.id] !== undefined;
                      return (
                        <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                          {isChecked && <div className={`absolute top-0 left-0 w-1.5 h-full ${bankResults[task.id] ? 'bg-green-500' : 'bg-red-500'}`}></div>}
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Практика</div>
                          <p className="whitespace-pre-wrap text-slate-800 text-[15px] leading-relaxed mb-6 font-medium">{task.text}</p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="text" placeholder="Ваш ответ..."
                              value={bankAnswers[task.id] || ''}
                              onChange={(e) => setBankAnswers(prev => ({ ...prev, [task.id]: e.target.value }))}
                              disabled={isChecked}
                              className={`flex-1 max-w-xs px-4 py-2.5 rounded-lg border font-medium ${isChecked ? (bankResults[task.id] ? 'border-green-400 bg-green-50 text-green-900' : 'border-red-400 bg-red-50 text-red-900') : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'} outline-none`}
                            />
                            {!isChecked ? (
                              <button onClick={() => handleBankAnswerCheck(task.id, task.answer)} disabled={!bankAnswers[task.id] || !bankAnswers[task.id].trim().length}
                                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                                Проверить
                              </button>
                            ) : (
                              <div className="flex items-center text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg">
                                {bankResults[task.id] ? <span className="text-green-600">Верно!</span> : <span className="text-red-600">Ответ: {task.answer}</span>}
                              </div>
                            )}
                          </div>
                          {isChecked && task.explanation && (
                            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm">
                              <span className="font-bold text-slate-900 block mb-1">Разбор:</span>
                              {task.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl"><Icons.BarChart /></div>
              <h2 className="text-3xl font-extrabold text-slate-900">Ваша статистика</h2>
            </div>
            {stats.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-lg font-medium">Вы ещё не решили ни одного полного варианта.</p>
                <button onClick={() => setActiveTab('home')} className="mt-4 text-blue-600 font-bold hover:underline">Вернуться на главную</button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold">Дата</th>
                      <th className="py-4 px-6 font-bold">Вариант</th>
                      <th className="py-4 px-6 font-bold">Баллы</th>
                      <th className="py-4 px-6 font-bold">Успешность</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.map((s, i) => {
                      const percentage = Math.round((s.score / s.total) * 100);
                      return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 text-slate-600 font-medium">{s.date}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">RUSEGE-{s.variant}</td>
                        <td className="py-4 px-6">
                          <span className={`py-1.5 px-3 rounded-lg font-bold text-sm ${percentage >= 80 ? 'bg-green-100 text-green-800' : percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {s.score} из {s.total}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center max-w-[200px]">
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mr-3 overflow-hidden">
                              <div className={`h-2.5 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: percentage + '%'}}></div>
                            </div>
                            <span className="font-bold text-slate-700">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
