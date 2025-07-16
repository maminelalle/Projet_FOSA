import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/fosaForm.css';
import useBlockBackButton from '../hooks/useBlockBackButton';


function FosaForm() {
  useBlockBackButton();
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    id: '',
    nom_fr: '',
    nom_ar: '',
    type: 'Hôpital',
    code_etablissement: '',
    longitude: 0.0,
    latitude: 0.0,
    adresse: '',
    responsable: '',
    commune: '',
    moughataa: 'Nouakchott',
    wilaya: 'Nouakchott',
    departement: 'Santé',
    contact: '',
    is_public: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const WILAYAS = ['Nouakchott', 'Trarza', 'Hodh El Gharbi', 'Dakhlet Nouadhibou', 'Gorgol'];
  const MOUGHTAAS = {
    'Nouakchott': ['Nouakchott-Nord', 'Nouakchott-Ouest', 'Nouakchott-Sud'],
    'Trarza': ['Nouadhibou', 'Rosso', 'Boutilimit'],
    'Hodh El Gharbi': ['Aioun', 'Timbedra', 'Tamchekett'],
    'Dakhlet Nouadhibou': ['Nouadhibou', 'Chami'],
    'Gorgol': ['Kaédi', 'Mboumba']
  };
  const DEPARTEMENTS = ['Santé', 'Administration', 'Finance'];
  const TYPES = [
    'Hôpital',
    'Centre de Santé',
    'Poste de Santé',
    'Direction Régionale de Santé',
    'Direction Administrative et Financière'
  ];

  useEffect(() => {
    if (id) {
      const loadFosa = async () => {
        try {
          const response = await API.get(`fosas/${id}/`);
          setFormData({
            ...response.data,
            id: response.data.id || response.data.code_etablissement
          });
        } catch (err) {
          setError(lang === 'fr' ? "Erreur lors du chargement de la FOSA" : "خطأ في تحميل FOSA");
          console.error(err);
        }
      };
      loadFosa();
    }
  }, [id, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.nom_fr || !formData.code_etablissement || !formData.longitude || !formData.latitude) {
      setError(lang === 'fr'
        ? 'Les champs obligatoires sont manquants (Nom FR, Code établissement, Coordonnées)'
        : 'الحقول الإلزامية مفقودة (الاسم الفرنسي، رمز المؤسسة، الإحداثيات)');
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      id: formData.id || formData.code_etablissement,
      longitude: parseFloat(formData.longitude) || 0.0,
      latitude: parseFloat(formData.latitude) || 0.0
    };

    try {
      if (id) {
        await API.put(`fosas/${id}/`, dataToSend);
      } else {
        await API.post('fosas/', dataToSend);
      }
      navigate('/fosas', { state: { shouldRefresh: true } });
    } catch (err) {
      setError(err.response?.data?.detail ||
        (lang === 'fr' ? "Erreur lors de l'enregistrement" : "خطأ أثناء الحفظ"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'wilaya') {
      setFormData(prev => ({
        ...prev,
        wilaya: value,
        moughataa: MOUGHTAAS[value] ? MOUGHTAAS[value][0] : ''
      }));
    }
  };

  const getLabel = (fr, ar) => lang === 'fr' ? fr : ar;
  const getPlaceholder = (fr, ar) => lang === 'fr' ? fr : ar;

  return (
    <div className="form-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{id ? (lang === 'fr' ? 'Modifier' : 'تعديل') : (lang === 'fr' ? 'Ajouter' : 'إضافة')} {lang === 'fr' ? 'une FOSA' : 'FOSA'}</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!id && (
          <div className="form-row">
            <div className="form-group">
              <label>{getLabel('ID (Code établissement) *', 'المعرف (رمز المؤسسة) *')}</label>
              <input
                type="text"
                name="code_etablissement"
                value={formData.code_etablissement}
                onChange={handleChange}
                required
                placeholder={getPlaceholder('Ex: DPR11', 'مثال: DPR11')}
              />
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>{getLabel('Nom Français *', 'الاسم الفرنسي *')}</label>
            <input
              type="text"
              name="nom_fr"
              value={formData.nom_fr}
              onChange={handleChange}
              required
              placeholder={getPlaceholder('Nom en français', 'الاسم بالفرنسية')}
            />
          </div>
          <div className="form-group">
            <label>{getLabel('Nom Arabe', 'الاسم العربي')}</label>
            <input
              type="text"
              name="nom_ar"
              value={formData.nom_ar}
              onChange={handleChange}
              placeholder={getPlaceholder('Nom en arabe', 'الاسم بالعربية')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{getLabel('Type *', 'النوع *')}</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {id && (
            <div className="form-group">
              <label>{getLabel('Code Établissement *', 'رمز المؤسسة *')}</label>
              <input
                type="text"
                name="code_etablissement"
                value={formData.code_etablissement}
                onChange={handleChange}
                required
                disabled
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{getLabel('Longitude *', 'خط الطول *')}</label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{getLabel('Latitude *', 'خط العرض *')}</label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{getLabel('Adresse', 'العنوان')}</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{getLabel('Responsable', 'المسؤول')}</label>
            <input
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{getLabel('Commune', 'البلدية')}</label>
            <input
              type="text"
              name="commune"
              value={formData.commune}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{getLabel('Moughataa', 'المقاطعة')}</label>
            <select
              name="moughataa"
              value={formData.moughataa}
              onChange={handleChange}
            >
              {MOUGHTAAS[formData.wilaya]?.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{getLabel('Wilaya', 'الولاية')}</label>
            <select
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
            >
              {WILAYAS.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{getLabel('Département', 'القسم')}</label>
            <select
              name="departement"
              value={formData.departement}
              onChange={handleChange}
            >
              {DEPARTEMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{getLabel('Contact', 'الهاتف')}</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{getLabel('Public ?', 'عام؟')}</label>
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/fosas')} className="cancel-btn" disabled={isLoading}>
            {lang === 'fr' ? 'Annuler' : 'إلغاء'}
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ?
              (lang === 'fr' ? 'En cours...' : 'جاري...') :
              (id ? (lang === 'fr' ? 'Mettre à jour' : 'تحديث') : (lang === 'fr' ? 'Enregistrer' : 'حفظ'))}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FosaForm;
