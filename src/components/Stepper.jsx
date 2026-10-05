const Stepper = ({ steps, current }) => {
  return (
    <ol className="flex w-full items-start">
      {steps.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.label}
            className={`relative flex flex-col items-center ${isLast ? '' : 'flex-1'}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className="flex w-full items-center">
              {/* 丸（番号 or チェック） */}
              <span
                className={`z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300 ${
                  isDone
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : isCurrent
                      ? 'border-blue-600 bg-white text-blue-600 ring-4 ring-blue-100'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>

              {/* 次の丸までの線（完了したら左から右へ塗られる） */}
              {!isLast && (
                <div className="mx-2 h-1 flex-1 overflow-hidden rounded bg-gray-200">
                  <div
                    className={`h-full bg-blue-600 transition-all duration-500 ${
                      isDone ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* ラベル（丸の下、左寄せ） */}
            <span
              className={`mt-2 self-start text-xs whitespace-nowrap ${
                isCurrent
                  ? 'font-bold text-blue-600'
                  : isDone
                    ? 'text-gray-700'
                    : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
