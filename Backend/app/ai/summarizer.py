from app.ai.providers.base import AIProvider
from datetime import datetime, timedelta
from app.db.models import UserSummary


SYSTEM_EN = "You are an assistant that creates concise user profile summaries."
USER_EN = """Based on the following conversation messages, 
summarize the most important things about this user: 
what they frequently ask, what topics they are interested in, 
what their preferences seem to be. Keep it short, meaningful, and helpful for personalization."""

SYSTEM_AR = "أنت مساعد يلخص اهتمامات المستخدم بإيجاز."
USER_AR = "بناءً على الرسائل التالية، لخّص أهم اهتمامات المستخدم ومواضيعه المتكررة. اجعل الملخص قصيراً ومفيداً."


async def summarize_history(provider: AIProvider, history: list[dict], lang: str) -> str:
    system = SYSTEM_AR if lang == "ar" else SYSTEM_EN
    messages = [{"role":"system","content":system}]
    for m in history[-20:]:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({
        "role":"user",
        "content":"Provide a concise profile like: 'Frequently asks about X, prefers Y...'"
        if lang != "ar" else "قدّم ملخصاً موجزاً مثل: 'يسأل كثيراً عن كذا، يفضّل كذا...'"
    })
    return await provider.chat(messages, lang)


async def update_chat_summary(prov, chat, db, lang: str, user_msg: str, assistant_msg: str):
    old_summary = chat.summary.summary if chat.summary else ""
    system = "أنت مساعد يحدّث ملخص المحادثة." if lang == "ar" else "You are an assistant that updates a chat summary."
    user_prompt = (
        f"Here is the current summary:\n\n{old_summary}\n\n"
        f"Now the user said:\n{user_msg}\n\n"
        f"And the assistant replied:\n{assistant_msg}\n\n"
        "Please update the summary so it remains short, meaningful, and reflects the new exchange."
    )

    convo = [{"role": "system", "content": system}, {"role": "user", "content": user_prompt}]
    new_summary = await prov.chat(convo, lang)

    if chat.summary:
        chat.summary.summary = new_summary
    else:
        from app.db.models import ChatSummary
        db.add(ChatSummary(chat_id=chat.id, lang=lang, summary=new_summary))
    db.commit()

    return new_summary



async def refresh_user_summary(prov, user, db, lang: str):
    existing = db.query(UserSummary).filter(UserSummary.user_id == user.id, UserSummary.lang == lang).first()
    if existing and existing.updated_at > datetime.utcnow() - timedelta(days=1):
        return existing.summary

    chat_summaries = [c.summary.summary for c in user.chats if c.summary]
    if not chat_summaries:
        return None

    system = "أنت مساعد يلخص اهتمامات المستخدم." if lang == "ar" else "You are an assistant that summarizes the user's main interests."
    user_prompt = (
        "بناءً على ملخصات المحادثات التالية، لخّص أهم اهتمامات هذا المستخدم ومواضيعه المتكررة."
        if lang == "ar"
        else "Based on the following chat summaries, summarize the most important things about this user: recurring topics, preferences, and interests."
    )

    convo = [{"role": "system", "content": system}]
    convo.extend([{"role": "assistant", "content": s} for s in chat_summaries])
    convo.append({"role": "user", "content": user_prompt})

    summary_text = await prov.chat(convo, lang)

    if existing:
        existing.summary = summary_text
    else:
        db.add(UserSummary(user_id=user.id, lang=lang, summary=summary_text))
    db.commit()

    return summary_text

