MESSAGES = {
  "en": {
    "auth.email_taken": "Email already registered.",
    "auth.invalid_credentials": "Invalid email or password.",
    "auth.logged_out": "Logged out successfully.",
    "ai.model_missing": "No AI model available. Configure an API key or use the open-source provider.",
    "ai.bad_lang": "Unsupported language. Use 'en' or 'ar'.",
  },
  "ar": {
    "auth.email_taken": "البريد الإلكتروني مسجل بالفعل.",
    "auth.invalid_credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "auth.logged_out": "تم تسجيل الخروج بنجاح.",
    "ai.model_missing": "لا يوجد نموذج متاح. قم بإعداد مفتاح API أو استخدم مزوداً مفتوح المصدر.",
    "ai.bad_lang": "لغة غير مدعومة. استخدم 'en' أو 'ar'.",
  }
}

def t(key: str, lang: str = "en") -> str:
    return MESSAGES.get(lang, MESSAGES["en"]).get(key, key)
