export function CompetitionResultTime({time, penalty, gap}) {
    return (
        <div className="competition-result-time_container">
            <div className="competition-result-time_time_penalty">
                <div className="competition-result-time_time text-body">{time}</div>
                {penalty > 0 && <div className="competition-result-time_penalty text-danger">+{penalty}</div>}
            </div>
            {gap && (
                <div className="competition-result-time-gap text-secondary">
                    {gap}
                </div>
            )}
        </div>
    );
}