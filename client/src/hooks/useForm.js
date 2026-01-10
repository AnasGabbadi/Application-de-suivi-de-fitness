import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les formulaires
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Function} validate - Fonction de validation (optionnelle)
 * @returns {Object} État et méthodes du formulaire
 */
const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gérer les changements de champs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    let fieldValue = value;
    
    // Gérer les différents types d'inputs
    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'file') {
      fieldValue = files;
    } else if (type === 'number') {
      fieldValue = value === '' ? '' : parseFloat(value);
    }

    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue,
    }));

    // Valider le champ si déjà touché et validation fournie
    if (touched[name] && validate) {
      const newValues = { ...values, [name]: fieldValue };
      const validationErrors = validate(newValues);
      
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
    }
  }, [values, touched, validate]);

  // Gérer le blur (perte de focus)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    // Valider le champ
    if (validate) {
      const validationErrors = validate(values);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
    }
  }, [values, validate]);

  // Gérer la soumission du formulaire
  const handleSubmit = useCallback((callback) => {
    return async (e) => {
      if (e) {
        e.preventDefault();
      }

      // Marquer tous les champs comme touchés
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Valider tous les champs
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        // Si des erreurs existent, ne pas soumettre
        if (Object.keys(validationErrors).length > 0) {
          // Trouver le premier champ avec erreur et y faire défiler
          const firstErrorField = Object.keys(validationErrors)[0];
          const element = document.getElementsByName(firstErrorField)[0];
          if (element) {
            element.focus();
          }
          return;
        }
      }

      // Soumettre le formulaire
      setIsSubmitting(true);
      
      try {
        await callback(values);
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        
        // Si l'erreur contient des erreurs de validation du backend
        if (error.errors && typeof error.errors === 'object') {
          setErrors(error.errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validate]);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Définir une valeur de champ spécifique
  const setFieldValue = useCallback((name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Valider le champ si déjà touché
    if (touched[name] && validate) {
      const newValues = { ...values, [name]: value };
      const validationErrors = validate(newValues);
      
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
    }
  }, [values, touched, validate]);

  // Définir une erreur de champ spécifique
  const setFieldError = useCallback((name, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);

  // Définir un champ comme touché
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: isTouched,
    }));
  }, []);

  // Vérifier si le formulaire est valide
  const isValid = Object.keys(errors).length === 0;

  // Vérifier si le formulaire a été modifié
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
  };
};

export default useForm;