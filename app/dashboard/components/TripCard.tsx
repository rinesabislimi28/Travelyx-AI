import type { TripRecord } from "../types";

type TripCardProps = {
  trip: TripRecord;
  isSelected: boolean;
  isEditing: boolean;
  isFavorite: boolean;
  editDestination: string;
  onEditDestinationChange: (val: string) => void;
  onSaveEdit: (id: string, e: React.MouseEvent) => void;
  onStartEdit: (trip: TripRecord, e: React.MouseEvent) => void;
  onDeleteClick: (id: string, e: React.MouseEvent) => void;
  onSelectTrip: (trip: TripRecord) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isSavingEdit?: boolean;
};

export default function TripCard({
  trip,
  isSelected,
  isEditing,
  isFavorite,
  editDestination,
  onEditDestinationChange,
  onSaveEdit,
  onStartEdit,
  onDeleteClick,
  onSelectTrip,
  onToggleFavorite,
  isSavingEdit = false,
}: TripCardProps) {
  const data = trip.itinerary_data || {};
  const userBudgetNumber = Number(data.user_budget) || Number(trip.budget) || 0;
  const totalSpent = Number(data.budget_estimate?.total_trip_cost) || 0;

  return (
    <div
      onClick={() => onSelectTrip(trip)}
      className={`cursor-pointer rounded-[1.5rem] border p-4 ${
        isSelected
          ? "border-[#ff855f]/50 bg-[#ff855f]/10"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={(e) => onToggleFavorite(trip.id, e)}
          className={`mt-0.5 text-lg ${isFavorite ? "text-[#ffd166]" : "text-slate-500"}`}
          title="Toggle favorite"
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                value={editDestination}
                onChange={(e) => onEditDestinationChange(e.target.value)}
                className="field px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
              <button
                onClick={(e) => onSaveEdit(trip.id, e)}
                className="button-primary px-3 py-2 text-sm"
                disabled={isSavingEdit}
              >
                {isSavingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <>
              <p className="text-lg font-bold text-white">{trip.destination || "Saved trip"}</p>
              <p className="mt-1 text-sm text-slate-400">
                {data.departure ? `${data.departure} to ` : ""}
                {data.destination || trip.destination || "Destination"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
        <span>{new Date(trip.created_at).toLocaleDateString("en-GB")}</span>
        <span>{data.itinerary?.length || 0} days</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Budget</p>
          <p className="mt-1 text-lg font-bold text-white">EUR {userBudgetNumber}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Cost</p>
          <p className="mt-1 text-lg font-bold text-white">EUR {totalSpent}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={(e) => onStartEdit(trip, e)} className="button-secondary px-3 py-2 text-xs">
          Rename
        </button>
        <button onClick={(e) => onDeleteClick(trip.id, e)} className="button-secondary px-3 py-2 text-xs">
          Delete
        </button>
      </div>
    </div>
  );
}
