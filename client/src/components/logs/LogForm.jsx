import { useState } from 'react';
import { Save, Plus, Minus, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatSeconds } from '../../utils/formatters';

const LogForm = ({ workout, onSubmit, isSubmitting }) => {
  const [sets, setSets] = useState(
    workout.exercices.map((ex) => ({
      exerciceId: ex.exerciceId._id || ex.exerciceId,
      exerciceNom: ex.exerciceId.nom || ex.exerciceData?.nom || 'Exercice',
      series: Array.from({ length: ex.seriesCible }, () => ({
        reps: ex.repsCible,
        poids: 0,
        completed: false,
      })),
      seriesCible: ex.seriesCible,
      repsCible: ex.repsCible,
    }))
  );

  const [notes, setNotes] = useState('');
  const [duree, setDuree] = useState(0);
  const [startTime] = useState(Date.now());

  // Calculer la durée en temps réel
  useState(() => {
    const interval = setInterval(() => {
      setDuree(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const updateSet = (exerciceIndex, setIndex, field, value) => {
    const newSets = [...sets];
    newSets[exerciceIndex].series[setIndex][field] = value;
    setSets(newSets);
  };

  const toggleSetCompleted = (exerciceIndex, setIndex) => {
    const newSets = [...sets];
    newSets[exerciceIndex].series[setIndex].completed = 
      !newSets[exerciceIndex].series[setIndex].completed;
    setSets(newSets);
  };

  const addSet = (exerciceIndex) => {
    const newSets = [...sets];
    const lastSet = newSets[exerciceIndex].series[newSets[exerciceIndex].series.length - 1];
    newSets[exerciceIndex].series.push({
      reps: lastSet?.reps || newSets[exerciceIndex].repsCible,
      poids: lastSet?.poids || 0,
      completed: false,
    });
    setSets(newSets);
  };

  const removeSet = (exerciceIndex, setIndex) => {
    const newSets = [...sets];
    if (newSets[exerciceIndex].series.length > 1) {
      newSets[exerciceIndex].series.splice(setIndex, 1);
      setSets(newSets);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const logData = {
      workoutId: workout._id,
      exercices: sets.map(ex => ({
        exerciceId: ex.exerciceId,
        series: ex.series.map(s => ({
          reps: parseInt(s.reps) || 0,
          poids: parseFloat(s.poids) || 0,
        })),
      })),
      duree: Math.floor(duree / 60), // Convertir en minutes
      notes: notes.trim(),
    };

    onSubmit(logData);
  };

  const totalSets = sets.reduce((sum, ex) => sum + ex.series.length, 0);
  const completedSets = sets.reduce(
    (sum, ex) => sum + ex.series.filter(s => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{workout.nom}</h2>
            <p className="text-primary-100 mt-1">Séance en cours</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{formatSeconds(duree)}</p>
            <p className="text-primary-100 text-sm">Temps écoulé</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>Progression</span>
            <span>{completedSets}/{totalSets} séries</span>
          </div>
          <div className="h-3 bg-primary-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercices */}
      <div className="space-y-6">
        {sets.map((exercice, exerciceIndex) => (
          <div
            key={exerciceIndex}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Exercise header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {exercice.exerciceNom}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Objectif: {exercice.seriesCible} séries × {exercice.repsCible} reps
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addSet(exerciceIndex)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Série</span>
                </button>
              </div>
            </div>

            {/* Sets */}
            <div className="p-6 space-y-3">
              {exercice.series.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className={cn(
                    'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all',
                    set.completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  )}
                >
                  {/* Set number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <span className="font-bold text-primary-700 dark:text-primary-300">
                      {setIndex + 1}
                    </span>
                  </div>

                  {/* Reps */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Répétitions
                    </label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exerciceIndex, setIndex, 'reps', e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold"
                    />
                  </div>

                  {/* Poids */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      value={set.poids}
                      onChange={(e) => updateSet(exerciceIndex, setIndex, 'poids', e.target.value)}
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold"
                    />
                  </div>

                  {/* Complete button */}
                  <button
                    type="button"
                    onClick={() => toggleSetCompleted(exerciceIndex, setIndex)}
                    className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all',
                      set.completed
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    <Check className="h-6 w-6" />
                  </button>

                  {/* Remove button */}
                  {exercice.series.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(exerciceIndex, setIndex)}
                      className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Minus className="h-5 w-5 mx-auto" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes de séance
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Comment s'est passée votre séance ? Difficultés, sensations..."
          className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || completedSets === 0}
          className={cn(
            'flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium',
            (isSubmitting || completedSets === 0) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Terminer la séance</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LogForm;