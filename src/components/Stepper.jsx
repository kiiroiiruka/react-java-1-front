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
                    ? 'border-ink bg-ink text-white'
                    : isCurrent
                      ? 'border-ink bg-surface text-ink ring-4 ring-ink/10'
                      : 'border-line bg-surface text-muted'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>

              {/* 次の丸までの線（完了したら左から右へ塗られる） */}
              {!isLast && (
                <div className="mx-2 h-1 flex-1 overflow-hidden rounded bg-line">
                  <div
                    className={`h-full bg-ink transition-all duration-500 ${
                      isDone ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* ラベル（丸の下、左寄せ） */}
            <span
              className={`mt-2 self-start text-sm whitespace-nowrap ${
                isCurrent
                  ? 'font-bold text-ink'
                  : isDone
                    ? 'text-body'
                    : 'text-muted'
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
