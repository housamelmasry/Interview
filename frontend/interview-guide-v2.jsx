import { useState } from "react";

const categories = [
  {
    id: "laravel-core",
    label: "Laravel Core",
    icon: "🔴",
    color: "#FF4444",
    questions: [
      {
        q: "ما الفرق بين Service Container و Service Provider؟",
        a: `Service Container هو نظام dependency injection في Laravel — يُعنى بـ binding وresolving الكلاسات.
Service Provider هو المكان الذي تُسجّل فيه هذه الـ bindings وتُهيئ مكونات التطبيق.

مثال:
• Container: يعرف كيف يبني كلاس Logger
• Provider: يخبر الـ Container "استخدم FileLogger عند طلب LoggerInterface"`,
      },
      {
        q: "اشرح Service Container و Dependency Injection بعمق",
        a: `Dependency Injection = تمرير التبعيات للكلاس بدلاً من أن ينشئها بنفسه.

Laravel Container يدعم:
1. Binding: app()->bind(Interface::class, Implementation::class)
2. Singleton: app()->singleton(...) — نسخة واحدة طوال الـ request
3. Auto-resolution: يحل الـ type hints تلقائياً من constructor
4. Contextual Binding: نفس الـ Interface لكن تطبيق مختلف حسب السياق`,
      },
      {
        q: "ما هو Eloquent ORM وما مزاياه وعيوبه؟",
        a: `المزايا:
• كود قابل للقراءة وسريع التطوير
• Relationships بسيطة (hasMany, belongsTo...)
• Mutators, Accessors, Observers
• Soft Deletes و Timestamps تلقائية

العيوب:
• N+1 Problem إن لم تستخدم eager loading
• أبطأ من Query Builder لعمليات bulk
• يصعب تحسين الأداء في queries معقدة

الحل: استخدم with() للـ eager loading، وQuery Builder للعمليات الثقيلة`,
      },
      {
        q: "ما هو N+1 Problem وكيف تحله؟",
        a: `يحدث عندما تجلب N record ثم تُنفّذ query إضافية لكل record.

مثال المشكلة:
$posts = Post::all(); // 1 query
foreach ($posts as $post) {
  echo $post->user->name; // N queries!
}

الحل - Eager Loading:
$posts = Post::with('user')->get(); // query واحدة فقط

يمكن اكتشافه بـ:
• Laravel Debugbar
• Telescope
• withCount() بدل العد اليدوي`,
      },
      {
        q: "ما الفرق بين Middleware و Policy و Gate؟",
        a: `Middleware: يعمل على مستوى الـ HTTP request قبل وصوله للـ controller
→ مثال: التحقق من تسجيل الدخول، CORS، Rate Limiting

Gate: تحقق بسيط من صلاحية action معين
→ مثال: Gate::define('edit-post', fn($user, $post) => $user->id === $post->user_id)

Policy: كلاس منظّم للصلاحيات المتعلقة بـ Model بعينه
→ مثال: PostPolicy تحتوي view, create, update, delete`,
      },
      {
        q: "كيف تعمل Laravel Queues وما فائدتها؟",
        a: `Queues تُؤجّل تنفيذ المهام الثقيلة خارج الـ HTTP request lifecycle.

الفائدة: تسريع الـ response للمستخدم

كيف تعمل:
1. Job يُدفع للـ Queue: dispatch(new SendEmailJob($user))
2. Worker يسحب الـ Job وينفّذه: php artisan queue:work

Drivers المتاحة: database, Redis, SQS, Beanstalkd

مفاهيم مهمة:
• Retry: عدد مرات إعادة المحاولة عند الفشل
• Delay: تأجيل الـ Job
• Horizon: واجهة مرئية لـ Redis queues`,
      },
      {
        q: "ما هو Observer Pattern في Laravel؟",
        a: `Observer يُراقب أحداث الـ Eloquent Model (creating, created, updating, updated, deleting...)

مثال:
class OrderObserver {
  public function created(Order $order) {
    // إرسال إشعار عند إنشاء طلب
  }
}

// في ServiceProvider:
Order::observe(OrderObserver::class);

الفائدة: فصل الـ business logic عن الـ Model`,
      },
      {
        q: "ما الفرق بين hasOne و belongsTo؟",
        a: `hasOne: الكلاس الحالي يمتلك كلاساً آخر (المفتاح الأجنبي في الجدول الآخر)
User hasOne Profile → في جدول profiles: user_id

belongsTo: الكلاس الحالي يتبع كلاساً آخر (المفتاح الأجنبي هنا)
Profile belongsTo User → في جدول profiles: user_id

القاعدة: من عنده foreign key يكتب belongsTo`,
      },
      {
        q: "ما هو Repository Pattern ولماذا يُستخدم في Laravel؟",
        a: `Repository يفصل منطق الوصول للبيانات عن الـ Business Logic.

interface UserRepositoryInterface {
  public function find(int $id): User;
  public function create(array $data): User;
}

class EloquentUserRepository implements UserRepositoryInterface { ... }

الفوائد:
• سهولة التبديل بين مصادر البيانات
• اختبار الكود بسهولة (Mock)
• كود أنظف وأقل تكراراً`,
      },
      {
        q: "كيف تتعامل مع Database Transactions؟",
        a: `DB::transaction(function () {
  $order = Order::create([...]);
  $payment = Payment::create([...]);
  // إذا حدث exception، سيتم Rollback تلقائياً
});

أو يدوياً:
DB::beginTransaction();
try {
  // operations
  DB::commit();
} catch (Exception $e) {
  DB::rollBack();
}

مهم: استخدمها عند تغيير بيانات متعددة مترابطة`,
      },
    ],
  },
  {
    id: "laravel-advanced",
    label: "Laravel Advanced",
    icon: "🟠",
    color: "#FF8C00",
    questions: [
      {
        q: "كيف تُحسّن أداء Laravel في الإنتاج؟",
        a: `1. Caching:
   • Route cache: php artisan route:cache
   • Config cache: php artisan config:cache
   • View cache: php artisan view:cache
   • Query cache باستخدام Redis

2. Eager Loading لحل N+1

3. Indexing على أعمدة قواعد البيانات المستخدمة في WHERE

4. Queue للعمليات الثقيلة

5. Horizon + Redis لمراقبة الـ queues

6. Octane (Swoole/RoadRunner) لتسريع جذري`,
      },
      {
        q: "ما هو Event Sourcing وهل طبّقته؟",
        a: `بدلاً من حفظ الحالة النهائية، نحفظ كل الأحداث التي أدت إليها.

مثال: بدلاً من حفظ balance = 500
نحفظ:
- AccountCreated (balance: 0)
- MoneyDeposited (amount: 600)
- MoneyWithdrawn (amount: 100)

الفوائد: Audit log كامل، إمكانية replay الأحداث
الأدوات في Laravel: spatie/laravel-event-sourcing`,
      },
      {
        q: "ما هو CQRS Pattern؟",
        a: `Command Query Responsibility Segregation

فصل عمليات الكتابة (Commands) عن القراءة (Queries):

Command: ينفّذ عملية ويغيّر الحالة (لا يُرجع بيانات)
Query: يقرأ البيانات فقط (لا يغيّر الحالة)

الفائدة: كل طرف يمكن تحسينه وتوسيعه باستقلالية
→ مثال: قاعدة بيانات للكتابة، وأخرى مُحسّنة للقراءة`,
      },
      {
        q: "كيف تتعامل مع API Rate Limiting؟",
        a: `في Laravel عبر Middleware:

// في RouteServiceProvider
RateLimiter::for('api', function (Request $request) {
  return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// في routes
Route::middleware(['throttle:api'])->group(...);

مستويات متقدمة:
• حدود مختلفة لـ authenticated vs guest
• Dynamic limits حسب نوع المستخدم
• Redis لتخزين العدادات`,
      },
      {
        q: "ما هو Lazy Loading vs Eager Loading vs Lazy Eager Loading؟",
        a: `Lazy Loading (افتراضي):
$post->user // query عند الوصول أول مرة فقط

Eager Loading:
Post::with('user')->get() // تحميل مع الـ query الأساسية

Lazy Eager Loading:
$posts = Post::all();
$posts->load('user'); // تحميل لاحق بـ query واحدة

متى تستخدم كل واحدة؟
• Eager: تعرف أنك ستحتاج العلاقة
• Lazy Eager: قررت لاحقاً أنك تحتاجها
• Lazy: علاقة نادر الاحتياج إليها`,
      },
    ],
  },
  {
    id: "backend-general",
    label: "Backend عام",
    icon: "🟢",
    color: "#00C853",
    questions: [
      {
        q: "ما الفرق بين REST و GraphQL؟",
        a: `REST:
• Endpoints محددة لكل resource
• قد تُرجع بيانات أكثر أو أقل مما تحتاج
• سهل التخزين المؤقت (Caching)
• أبسط في الاستخدام للـ simple APIs

GraphQL:
• Query واحدة تجلب بالضبط ما تحتاجه
• تحل Over-fetching و Under-fetching
• أصعب في الـ Caching
• مثالي للـ complex data requirements وتطبيقات Mobile`,
      },
      {
        q: "ما هو SOLID وكيف تطبّقه؟",
        a: `S - Single Responsibility: كل كلاس مسؤولية واحدة
O - Open/Closed: مفتوح للتمديد، مغلق للتعديل
L - Liskov Substitution: الـ subclass قابل للاستبدال بـ parent
I - Interface Segregation: interfaces صغيرة ومحددة
D - Dependency Inversion: اعتمد على abstractions لا implementations

أهمها عملياً في Laravel:
• S: افصل الـ Services عن Controllers
• D: حقن Interfaces وليس Classes مباشرة`,
      },
      {
        q: "ما هو الفرق بين SQL و NoSQL؟",
        a: `SQL (Relational):
• بيانات منظمة في جداول وعلاقات
• ACID transactions
• مثالي للبيانات ذات العلاقات المعقدة
• أمثلة: MySQL, PostgreSQL

NoSQL:
• مرونة في الـ schema
• أداء أعلى في الـ write-heavy ops
• أنواع: Document (MongoDB), Key-Value (Redis), Column (Cassandra)
• مثالي للبيانات الضخمة وغير المنتظمة

الاختيار يعتمد على طبيعة البيانات والـ use case`,
      },
      {
        q: "كيف تصمم نظام Authentication آمن؟",
        a: `1. كلمات المرور: bcrypt/argon2 (لا MD5/SHA1 أبداً)
2. HTTPS إلزامي لكل الـ endpoints
3. JWT: قصير الصلاحية + Refresh Tokens
4. Rate Limiting على login endpoint
5. 2FA للحسابات الحساسة
6. لا تُرجع معلومات توضح إن كان الـ email موجوداً
7. HttpOnly Cookies للـ tokens (لا localStorage)
8. CSRF Protection للـ form-based auth`,
      },
      {
        q: "ما هو Database Indexing وكيف تختار الـ Index؟",
        a: `Index = بنية بيانات تُسرّع البحث مقابل تبطيء الكتابة.

متى تضيف Index:
• الأعمدة في WHERE كثيراً
• الأعمدة في ORDER BY
• Foreign Keys

أنواع:
• Single Column: على عمود واحد
• Composite: على أكثر من عمود (الترتيب مهم!)
• Unique Index: يمنع التكرار

تجنّب:
• فهرسة أعمدة ذات cardinality منخفض (مثل: gender)
• فهرسة زائدة تُبطئ الكتابة`,
      },
      {
        q: "ما هي ACID Properties؟",
        a: `Atomicity: كل العمليات تنجح أو كلها تفشل (لا نصف عملية)
Consistency: البيانات تبقى في حالة صحيحة دائماً
Isolation: الـ transactions المتزامنة لا تتداخل
Durability: البيانات المحفوظة لا تُفقد حتى عند الأعطال

مثال عملي: تحويل بنكي
1. Atomicity: خصم + إضافة يحدثان معاً أو لا يحدثان
2. Consistency: المجموع الكلي لا يتغير
3. Isolation: تحويلان متزامنان لا يتضاربان
4. Durability: بعد التأكيد، التحويل محفوظ نهائياً`,
      },
      {
        q: "ما هو Caching وما أنواعه؟",
        a: `Application Cache (Redis/Memcached):
• بيانات مؤقتة في الذاكرة
• Cache::remember('key', ttl, fn() => ...)

HTTP Cache:
• Cache-Control headers
• ETag و Last-Modified

Database Query Cache:
• تخزين نتائج queries متكررة

CDN Cache:
• تخزين static assets قريباً من المستخدم

استراتيجيات الإلغاء:
• TTL: انتهاء صلاحية تلقائي
• Cache Tags: إلغاء مجموعة مترابطة
• Cache Busting: تغيير الـ key عند تحديث البيانات`,
      },
      {
        q: "كيف تتعامل مع Concurrency وRace Conditions؟",
        a: `Race Condition: نتيجة تعتمد على ترتيب غير محدد لعمليات متزامنة

الحلول:
1. Database Locks:
   Post::where('id', $id)->lockForUpdate()->first();

2. Atomic Operations:
   DB::table('accounts')->increment('balance', 100);

3. Redis Locks (Distributed):
   Cache::lock('key', 10)->block(5, function() { ... });

4. Queue: تحويل العمليات المتزامنة إلى متسلسلة`,
      },
      {
        q: "ما هو الفرق بين Monolith و Microservices؟",
        a: `Monolith:
+ أبسط في البداية والـ deployment
+ لا latency بين الخدمات
- صعب التوسع الانتقائي
- كل شيء مترابط

Microservices:
+ توسع انتقائي لكل خدمة
+ استقلالية الفرق والـ deployment
- تعقيد في الـ communication
- حاجة لـ API Gateway, Service Discovery
- Distributed transactions أصعب

التوصية: ابدأ Monolith، وانتقل لـ Microservices عند الحاجة الفعلية`,
      },
      {
        q: "ما هي HTTP Status Codes المهمة لـ API؟",
        a: `2xx - نجاح:
200 OK, 201 Created, 204 No Content

4xx - خطأ العميل:
400 Bad Request (بيانات غلط)
401 Unauthorized (غير مُعرَّف)
403 Forbidden (معروف لكن لا صلاحية)
404 Not Found
409 Conflict (تعارض البيانات)
422 Unprocessable Entity (validation error)
429 Too Many Requests

5xx - خطأ السيرفر:
500 Internal Server Error
503 Service Unavailable

مهم: 401 vs 403
401 = من أنت؟ (سجّل دخولك)
403 = أعرف من أنت، لكن لا تملك الصلاحية`,
      },
    ],
  },
  {
    id: "system-design",
    label: "System Design",
    icon: "🔵",
    color: "#2979FF",
    questions: [
      {
        q: "كيف تصمم نظاماً يتحمل ملايين المستخدمين؟",
        a: `1. Load Balancing: توزيع الـ requests على عدة servers
2. Horizontal Scaling: إضافة servers بدلاً من تقوية واحد
3. Caching Layer: Redis/Memcached لتقليل الضغط على DB
4. CDN: للـ static content
5. Database:
   • Read Replicas: توزيع القراءة
   • Sharding: توزيع البيانات
6. Async Processing: Queues للعمليات الثقيلة
7. Database Connection Pooling
8. Microservices: فصل الخدمات للتوسع الانتقائي`,
      },
      {
        q: "ما هو CAP Theorem؟",
        a: `في نظام موزّع، لا يمكنك ضمان الثلاثة معاً:

C - Consistency: كل node يرى نفس البيانات
A - Availability: كل request يحصل على response
P - Partition Tolerance: النظام يعمل رغم انقطاع الشبكة

الـ Partition حتمي في الأنظمة الموزعة، فالاختيار بين:
• CP (مثل MongoDB, Redis): الاتساق على حساب التوفر
• AP (مثل Cassandra, CouchDB): التوفر على حساب الاتساق

معظم الأنظمة الحديثة تختار AP مع eventual consistency`,
      },
      {
        q: "كيف تصمم نظام تخزين ملفات قابل للتوسع؟",
        a: `المكونات:
1. Object Storage: S3/Google Cloud Storage (لا local storage)
2. CDN: CloudFront/Cloudflare لتوصيل سريع
3. Metadata DB: معلومات الملفات في SQL/NoSQL
4. Processing Queue: ضغط صور، تحويل صيغ بالـ background

تصميم الـ Upload:
• Presigned URLs: العميل يرفع مباشرة لـ S3 (لا يمر بسيرفرك)
• Chunked Upload للملفات الكبيرة
• Virus Scanning قبل الحفظ النهائي

في Laravel: Storage::disk('s3')->put(...)`,
      },
    ],
  },
  {
    id: "nodejs",
    label: "Node.js",
    icon: "🟡",
    color: "#F7DF1E",
    questions: [
      {
        q: "كيف يعمل Event Loop في Node.js؟",
        a: `Node.js يعمل على خيط واحد (Single Thread) لكنه غير متزامن بفضل Event Loop.

مراحل Event Loop بالترتيب:
1. timers: تنفيذ setTimeout و setInterval
2. I/O callbacks: callbacks من عمليات I/O
3. idle/prepare: داخلي
4. poll: انتظار أحداث I/O جديدة
5. check: تنفيذ setImmediate
6. close callbacks: مثل socket.on('close')

الفرق بين setTimeout و setImmediate:
• setTimeout(fn, 0): ينفّذ في مرحلة timers
• setImmediate(fn): ينفّذ في مرحلة check (أسرع في I/O context)

process.nextTick: ينفّذ قبل الانتقال لأي مرحلة (أولوية قصوى)`,
      },
      {
        q: "ما الفرق بين Callback و Promise و Async/Await؟",
        a: `Callback (القديم):
fs.readFile('file', (err, data) => {
  if (err) throw err;
  // Callback Hell إذا تداخلت
});

Promise:
fs.promises.readFile('file')
  .then(data => ...)
  .catch(err => ...);

Async/Await (الأفضل):
try {
  const data = await fs.promises.readFile('file');
} catch (err) { ... }

الأداء: متطابق تقريباً، لكن Async/Await أوضح وأسهل في الـ debugging
مشكلة شائعة: await داخل forEach لا يعمل كما تتوقع — استخدم for...of`,
      },
      {
        q: "ما هو Cluster Module ولماذا نستخدمه؟",
        a: `Node.js يعمل على core واحد افتراضياً. Cluster يُمكّنه من استخدام كل cores الـ CPU.

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // ينشئ Worker process
  }
} else {
  // كود السيرفر هنا
  app.listen(3000);
}

البديل الحديث: PM2 يدير الـ clustering تلقائياً
pm2 start app.js -i max`,
      },
      {
        q: "ما هو Stream في Node.js وما فائدته؟",
        a: `Stream = معالجة البيانات قطعة قطعة بدلاً من تحميلها كاملة في الذاكرة.

أنواع Streams:
• Readable: قراءة بيانات (fs.createReadStream)
• Writable: كتابة بيانات (fs.createWriteStream)
• Duplex: قراءة وكتابة (TCP socket)
• Transform: تحويل البيانات (zlib, crypto)

مثال عملي — رفع ملف كبير:
// ❌ بدون Stream: يحمّل الملف كله في RAM
// ✅ مع Stream:
fs.createReadStream('bigfile.csv')
  .pipe(csvParser())
  .pipe(dbWriteStream);

الفائدة: ذاكرة ثابتة حتى مع ملفات ضخمة`,
      },
      {
        q: "ما الفرق بين require و import في Node.js؟",
        a: `require (CommonJS — الافتراضي في Node):
• متزامن (Synchronous)
• يمكن استخدامه في أي مكان بالكود
• const express = require('express')

import (ES Modules):
• غير متزامن (Asynchronous)
• يجب أن يكون في أعلى الملف
• import express from 'express'
• يحتاج "type": "module" في package.json أو امتداد .mjs

التوجه الحديث: ES Modules هو المستقبل، لكن CommonJS لا يزال شائعاً جداً`,
      },
      {
        q: "كيف تتعامل مع Memory Leaks في Node.js؟",
        a: `أسباب شائعة للـ Memory Leaks:
1. Event Listeners لم تُزل (emitter.removeListener)
2. Closures تحتفظ بـ references غير ضرورية
3. Global variables تتراكم
4. Caching بدون حد أقصى

أدوات الكشف:
• process.memoryUsage() للمراقبة
• --inspect flag مع Chrome DevTools
• clinic.js أو 0x للتحليل العميق
• heapdump لتحليل الـ heap

نصيحة: استخدم WeakMap/WeakSet للـ caches — تُفرغ تلقائياً مع Garbage Collection`,
      },
      {
        q: "ما هو Middleware في Express وكيف يعمل؟",
        a: `Middleware = دالة تُنفَّذ بين استقبال الـ request وإرسال الـ response.

التوقيع: (req, res, next) => { ... }

أنواع:
1. Application-level: app.use(fn)
2. Router-level: router.use(fn)
3. Error-handling: (err, req, res, next) => {}
4. Built-in: express.json(), express.static()
5. Third-party: cors(), helmet(), morgan()

الترتيب مهم جداً — يُنفَّذ بالتسلسل:
app.use(logger);      // 1
app.use(auth);        // 2
app.use('/api', router); // 3

لا تنسَ استدعاء next() وإلا الـ request سيتوقف`,
      },
      {
        q: "كيف تحمي Node.js API من الهجمات الشائعة؟",
        a: `1. Helmet: يضبط HTTP headers الأمنية
   app.use(helmet())

2. Rate Limiting:
   app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }))

3. CORS صحيح:
   app.use(cors({ origin: 'https://myapp.com' }))

4. Input Validation:
   Joi أو Zod لـ validate كل input

5. SQL/NoSQL Injection:
   استخدم parameterized queries دائماً

6. JWT Secrets قوية + انتهاء صلاحية قصير

7. لا تُظهر stack traces في الـ production

8. حدّث dependencies دورياً (npm audit)`,
      },
      {
        q: "ما الفرق بين process.nextTick و setImmediate و setTimeout(fn, 0)؟",
        a: `ترتيب التنفيذ:
1. process.nextTick ← ينفّذ فوراً بعد انتهاء الكود الحالي (قبل Event Loop)
2. Promise.then ← Microtask queue (بعد nextTick)
3. setImmediate ← في مرحلة check من Event Loop
4. setTimeout(fn, 0) ← في مرحلة timers (قد يكون بعد setImmediate)

مثال:
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));

النتيجة:
nextTick → promise → immediate → timeout

استخدم process.nextTick بحذر — يمكن أن يُعيق Event Loop إذا أُسيء استخدامه`,
      },
      {
        q: "ما هو Worker Threads وكيف يختلف عن Cluster؟",
        a: `Cluster:
• يُنشئ processes مستقلة كاملة
• كل process له memory منفصلة
• مثالي لتوزيع HTTP requests

Worker Threads:
• خيوط داخل نفس الـ process
• تشارك الـ memory (SharedArrayBuffer)
• مثالي للـ CPU-intensive tasks

const { Worker } = require('worker_threads');
const worker = new Worker('./heavy-task.js');
worker.on('message', (result) => console.log(result));

متى تستخدم كل؟
• Cluster: scaling الـ API server
• Worker Threads: معالجة صور، encryption، ML inference`,
      },
    ],
  },
  {
    id: "react",
    label: "React",
    icon: "⚛️",
    color: "#61DAFB",
    questions: [
      {
        q: "كيف يعمل Virtual DOM وما فائدته؟",
        a: `Virtual DOM = نسخة خفيفة من الـ DOM الحقيقي محفوظة في الذاكرة.

كيف يعمل:
1. عند تغيّر الـ state، React يبني Virtual DOM جديد
2. يقارنه مع القديم (Diffing Algorithm)
3. يُطبّق فقط التغييرات على الـ DOM الحقيقي (Reconciliation)

الفائدة: تلاعب الـ DOM الحقيقي بطيء — Virtual DOM يُقلّل العمليات للحد الأدنى

ملاحظة: React 18 مع Concurrent Mode يُحسّن هذا أكثر بـ Time Slicing`,
      },
      {
        q: "ما الفرق بين useEffect و useLayoutEffect؟",
        a: `useEffect:
• يُنفَّذ بعد أن يُرسَم الـ component للشاشة (asynchronously)
• لا يُعيق الـ rendering
• مناسب للـ: API calls، subscriptions، timers

useLayoutEffect:
• يُنفَّذ بعد الـ DOM mutations لكن قبل أن يرى المستخدم التغيير (synchronously)
• يُعيق الـ rendering حتى ينتهي
• مناسب للـ: قراءة أبعاد الـ DOM، تعديلات بصرية فورية

القاعدة: استخدم useEffect دائماً إلا إذا لاحظت وميضاً بصرياً (flicker)`,
      },
      {
        q: "اشرح React Reconciliation و Fiber Architecture",
        a: `Reconciliation: عملية مقارنة الـ Virtual DOM القديم بالجديد لتحديد التغييرات

قواعد Diffing:
• عناصر من نوع مختلف → إعادة بناء كاملة
• عناصر من نفس النوع → تحديث الخصائص فقط
• key prop → يُساعد React على تتبع العناصر في القوائم

React Fiber (React 16+):
• إعادة كتابة كاملة للـ reconciliation engine
• يُقسّم العمل إلى وحدات صغيرة (fibers)
• يدعم إيقاف العمل واستئنافه (Concurrent Features)
• يُتيح: Suspense، Transitions، Time Slicing`,
      },
      {
        q: "ما هو useMemo و useCallback ومتى تستخدمهما؟",
        a: `useMemo: يحفظ نتيجة حسابٍ ثقيل
const sorted = useMemo(() => heavySort(list), [list]);
// يُعيد الحساب فقط إذا تغيّر list

useCallback: يحفظ دالة لمنع إعادة إنشائها
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

متى تستخدمهما؟
✅ دوال تُمرَّر كـ props لـ components محمية بـ React.memo
✅ حسابات ثقيلة فعلاً (ترتيب، فلترة قوائم ضخمة)
✅ dependencies في useEffect

❌ لا تستخدمهما في كل مكان — التحسين المبكر مشكلة بحد ذاتها`,
      },
      {
        q: "ما هو React.memo وكيف يختلف عن useMemo؟",
        a: `React.memo: يمنع إعادة render الـ component إذا لم تتغيّر الـ props
const MyComponent = React.memo(({ name }) => {
  return <div>{name}</div>;
});

useMemo: يحفظ نتيجة حساب داخل component

الفرق:
• React.memo → يحفظ الـ component نفسه
• useMemo → يحفظ قيمة داخل الـ component

مشكلة شائعة:
React.memo بلا فائدة إذا مررت object أو function جديدة في كل render
الحل: استخدم useMemo/useCallback مع props التي تُمرّرها`,
      },
      {
        q: "ما هو Context API وما حدوده مقارنةً بـ Redux؟",
        a: `Context API:
• مناسب لبيانات قليلة التغيير: theme، language، user
• بسيط بدون مكتبات إضافية
• مشكلة: كل consumer يُعاد render عند أي تغيير في الـ context

Redux (أو Zustand/Jotai):
• مناسب لـ state معقد وكثير التغيير
• DevTools ممتازة لتتبع التغييرات
• Selectors تمنع re-renders غير ضرورية
• أثقل في الـ boilerplate

التوجه الحديث:
• Zustand أو Jotai بدلاً من Redux للتبسيط
• Context للـ static/slow-changing data فقط`,
      },
      {
        q: "كيف تتعامل مع Code Splitting و Lazy Loading؟",
        a: `Code Splitting: تقسيم الـ bundle إلى أجزاء تُحمّل عند الحاجة

React.lazy + Suspense:
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}

Route-based splitting (أفضل استراتيجية):
كل صفحة/route لها bundle منفصل

Dynamic imports:
const chart = await import('heavy-chart-lib');

الفائدة: تسريع Initial Load Time بشكل كبير`,
      },
      {
        q: "ما هو الفرق بين Controlled و Uncontrolled Components؟",
        a: `Controlled Component:
الـ state في React يتحكم بقيمة الـ input
<input value={name} onChange={e => setName(e.target.value)} />
✅ مصدر حقيقة واحد، تحقق فوري، سهل الاختبار

Uncontrolled Component:
الـ DOM يتحكم بالقيمة، نقرأها بـ ref
const inputRef = useRef();
<input ref={inputRef} />
const value = inputRef.current.value;
✅ أبسط للنماذج غير المعقدة
❌ أصعب في التحقق الفوري

React Hook Form: يستخدم Uncontrolled internally للأداء لكن يوفر واجهة Controlled`,
      },
      {
        q: "ما هو Suspense و Concurrent Mode في React 18؟",
        a: `Concurrent Mode: React يستطيع إيقاف وإستئناف وإلغاء الـ rendering

الميزات الجديدة في React 18:
• useTransition: تمييز updates غير عاجلة
  const [isPending, startTransition] = useTransition();
  startTransition(() => setFilter(value));

• useDeferredValue: تأجيل تحديث قيمة
  const deferred = useDeferredValue(searchTerm);

• Automatic Batching: تجميع setStates تلقائياً حتى في async

Suspense للبيانات (مع frameworks):
<Suspense fallback={<Loading />}>
  <DataComponent /> {/* يُعلّق حتى تُحمّل البيانات */}
</Suspense>`,
      },
      {
        q: "ما هي Custom Hooks وكيف تصممها؟",
        a: `Custom Hook = دالة تبدأ بـ use وتحتوي hooks أخرى، تُعيد استخدام الـ stateful logic.

مثال — useFetch:
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// الاستخدام:
const { data, loading } = useFetch('/api/users');

أمثلة شائعة: useDebounce، useLocalStorage، useWindowSize، useIntersectionObserver`,
      },
    ],
  },
  {
    id: "react-native",
    label: "React Native",
    icon: "📱",
    color: "#00D8FF",
    questions: [
      {
        q: "كيف يعمل React Native — ما هو Bridge وما بعده؟",
        a: `Architecture القديمة (Bridge):
JS Thread ←→ Bridge (JSON serialization) ←→ Native Thread
المشكلة: الـ Bridge يُسبّب تأخيراً وازدحاماً خصوصاً في الـ animations

Architecture الجديدة (New Architecture - RN 0.71+):
• JSI (JS Interface): تواصل مباشر بين JS وـ C++ بدون serialization
• Fabric: renderer جديد أسرع (synchronous)
• TurboModules: تحميل Native Modules عند الطلب فقط
• Codegen: توليد كود آمن من TypeScript specs

النتيجة: أداء أقرب للـ native، رسوم متحركة أسلس`,
      },
      {
        q: "ما الفرق بين React Native CLI و Expo؟",
        a: `Expo:
✅ إعداد سريع، بدون Xcode/Android Studio
✅ OTA Updates (تحديث بدون App Store)
✅ مكتبات جاهزة (camera, location...)
❌ حجم تطبيق أكبر
❌ محدودية في Native modules مخصصة
❌ Expo Go له قيود في الـ production

React Native CLI:
✅ تحكم كامل في الـ native code
✅ أي native library
✅ حجم تطبيق أصغر
❌ يحتاج إعداد Xcode + Android Studio
❌ أصعب في البداية

التوصية: Expo (Bare Workflow) — تجمع بين مزايا الاثنين`,
      },
      {
        q: "كيف تُحسّن أداء React Native؟",
        a: `1. FlatList بدلاً من ScrollView للقوائم الطويلة:
   keyExtractor، getItemLayout، initialNumToRender

2. Hermes Engine: تفعيله لتسريع JS execution وتقليل الـ memory

3. تجنّب Anonymous Functions في render:
   // ❌ onPress={() => handle(item)}
   // ✅ const handlePress = useCallback(...)

4. useNativeDriver: true في الـ animations

5. InteractionManager: تأجيل العمليات الثقيلة بعد الـ animation

6. React.memo + useMemo للـ components الثقيلة

7. Reanimated 2: animations تعمل على UI Thread مباشرة

8. تقليل bridge calls في الـ loops`,
      },
      {
        q: "ما هو Metro Bundler وكيف يعمل؟",
        a: `Metro هو الـ JavaScript bundler الخاص بـ React Native (مثل Webpack).

مهامه:
• يجمع كل ملفات JS والـ assets في bundle واحد
• يدعم Fast Refresh (تحديث فوري بدون فقدان الـ state)
• يحوّل JSX و TypeScript
• يدير الـ module resolution

التحسينات:
• RAM Bundles: تحميل modules عند الطلب (للتطبيقات الكبيرة)
• Inline Requires: تأجيل تحميل الـ modules
• Source Maps للـ debugging`,
      },
      {
        q: "كيف تتعامل مع Navigation في React Native؟",
        a: `React Navigation (الأكثر شيوعاً):

أنواع الـ Navigators:
• Stack Navigator: شاشات فوق بعض (push/pop)
• Tab Navigator: تبويبات سفلية
• Drawer Navigator: قائمة جانبية
• Bottom Sheet Navigator

أفضل ممارسات:
• nested navigators للتطبيقات المعقدة
• navigationRef للتنقل خارج الـ components
• Deep Linking لفتح شاشات من links خارجية
• TypeScript مع typed params لمنع الأخطاء

البديل: Expo Router (file-based routing مثل Next.js)`,
      },
      {
        q: "ما الفرق بين StyleSheet.create و inline styles؟",
        a: `Inline styles:
<View style={{ flex: 1, backgroundColor: 'red' }} />
• object جديد في كل render
• أبطأ قليلاً

StyleSheet.create:
const styles = StyleSheet.create({ container: { flex: 1 } });
<View style={styles.container} />

المزايا:
• يُنشأ مرة واحدة ويُخزَّن
• validation في development
• إرسال الـ ID بدلاً من الـ object عبر Bridge (في الـ old architecture)
• أسرع وأنظف

ملاحظة: لا تفرق كبيرة في الـ new architecture، لكن StyleSheet لا يزال الممارسة الأفضل للنظافة`,
      },
      {
        q: "كيف تتعامل مع الـ Platform Differences؟",
        a: `Platform module:
import { Platform } from 'react-native';

const styles = {
  padding: Platform.OS === 'ios' ? 20 : 16,
  ...Platform.select({
    ios: { shadowColor: '#000' },
    android: { elevation: 4 },
  }),
};

Platform-specific files:
Component.ios.js  ← يُحمَّل على iOS
Component.android.js  ← يُحمَّل على Android

Safe Area:
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// للتعامل مع notch وـ home indicator

StatusBar: ضبطها لكل شاشة حسب الـ design`,
      },
      {
        q: "ما هو Reanimated وكيف يختلف عن Animated API؟",
        a: `Animated API (built-in):
• الـ animations تعمل على JS Thread
• إذا كان الـ JS thread مشغولاً → animation تتأتأ
• useNativeDriver: true يحسّن الوضع لكن مع قيود

React Native Reanimated 2:
• الـ animations تعمل على UI Thread مباشرة (بلا bridge)
• أداء مثالي حتى مع JS thread مشغول
• worklets: كود JS يعمل على UI Thread

مثال:
const offset = useSharedValue(0);
const animatedStyles = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],
}));

Gesture Handler: يُكمل Reanimated لـ gestures سلسة`,
      },
      {
        q: "كيف تتعامل مع الـ State Management في React Native؟",
        a: `نفس خيارات React مع اعتبارات إضافية:

للـ state البسيط: useState + Context

للـ state المعقد:
• Zustand (الأخف والأبسط)
• Redux Toolkit (للمشاريع الكبيرة)
• Jotai/Recoil (atomic state)

للـ Server State:
• TanStack Query (React Query) — الأفضل للـ API calls
• يدير caching، loading، error، refetching تلقائياً

للـ Persistence (حفظ بين الجلسات):
• AsyncStorage: بسيط، للبيانات الصغيرة
• MMKV: أسرع بـ 10x من AsyncStorage (مُوصى به)
• WatermelonDB: قواعد بيانات معقدة`,
      },
      {
        q: "كيف تتعامل مع Push Notifications؟",
        a: `الأدوات:
• Expo Notifications: الأسهل مع Expo
• Firebase Cloud Messaging (FCM): Android + iOS
• APNs: لـ iOS مباشرة

الخطوات الأساسية:
1. طلب إذن المستخدم
2. الحصول على Device Token
3. إرسال Token للـ backend
4. Backend يرسل notification عبر FCM/APNs

التعامل مع الـ states:
• Foreground: التطبيق مفتوح
• Background: التطبيق في الخلفية
• Quit: التطبيق مغلق تماماً

كل state يحتاج معالجة مختلفة للـ notification`,
      },
    ],
  },
  {
    id: "testing",
    label: "Testing & Security",
    icon: "🟣",
    color: "#AA00FF",
    questions: [
      {
        q: "ما الفرق بين Unit Test و Feature Test و Integration Test؟",
        a: `Unit Test:
• اختبار وحدة واحدة معزولة (method/class)
• سريع جداً، لا يحتاج DB أو external services
• يستخدم Mocking

Feature Test (في Laravel):
• اختبار feature كاملة من HTTP request لـ response
• يستخدم DB الفعلية (عادة SQLite in-memory)
• php artisan test

Integration Test:
• اختبار تكامل عدة مكونات
• أبطأ من Unit لكن أشمل

التوصية: اكتب Unit للـ business logic، Feature للـ API endpoints`,
      },
      {
        q: "ما هو SQL Injection وكيف تمنعه في Laravel؟",
        a: `SQL Injection: مهاجم يُدرج SQL code في input المستخدم

مثال الهجوم:
Username: admin' OR '1'='1

الحماية في Laravel:
1. Eloquent ORM: محمي تلقائياً
2. Query Builder مع bindings:
   DB::select('SELECT * FROM users WHERE id = ?', [$id])
3. لا تستخدم DB::raw() مع input المستخدم مباشرة

أبداً لا تكتب:
DB::select("SELECT * FROM users WHERE id = $id") ❌`,
      },
      {
        q: "ما هو XSS وكيف تحميه في Laravel؟",
        a: `XSS (Cross-Site Scripting): حقن JavaScript ضار في الصفحة

في Blade:
• {{ $data }} → هروب تلقائي ✅
• {!! $data !!} → بدون هروب (خطر!) ⚠️

حماية إضافية:
• Content Security Policy headers
• HttpOnly Cookies
• Validate وSanitize كل input
• استخدم {!! !!} فقط لـ HTML موثوق من نظامك`,
      },
    ],
  },
];

export default function InterviewGuide() {
  const [activeCategory, setActiveCategory] = useState("laravel-core");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [search, setSearch] = useState("");

  const current = categories.find((c) => c.id === activeCategory);

  const filtered = search.trim()
    ? categories.flatMap((cat) =>
        cat.questions
          .filter(
            (q) =>
              q.q.includes(search) ||
              q.a.includes(search)
          )
          .map((q) => ({ ...q, catColor: cat.color, catLabel: cat.label }))
      )
    : current.questions.map((q) => ({
        ...q,
        catColor: current.color,
        catLabel: current.label,
      }));

  const totalQ = categories.reduce((s, c) => s + c.questions.length, 0);

  return (
    <div style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif", direction: "rtl", background: "#0d0d0d", minHeight: "100vh", color: "#e8e8e8" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0533 0%, #0d1a2e 50%, #0d0d0d 100%)", padding: "2.5rem 2rem 2rem", borderBottom: "1px solid #222", textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: "#666", marginBottom: "0.75rem", textTransform: "uppercase" }}>دليل المقابلات الشامل</div>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 900, margin: 0, background: "linear-gradient(90deg, #FF4444, #FF8C00, #2979FF, #AA00FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Laravel · Node.js · React · React Native · Backend
        </h1>
        <div style={{ color: "#555", marginTop: "0.5rem", fontSize: "0.9rem" }}>{totalQ} سؤال وإجابة موثّقة</div>

        {/* Search */}
        <div style={{ marginTop: "1.5rem", maxWidth: "420px", margin: "1.5rem auto 0" }}>
          <input
            placeholder="🔍  ابحث في الأسئلة..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenQuestion(null); }}
            style={{ width: "100%", padding: "0.75rem 1.25rem", borderRadius: "50px", border: "1px solid #333", background: "#1a1a1a", color: "#e8e8e8", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", textAlign: "right" }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!search && (
        <div style={{ display: "flex", gap: "0.5rem", padding: "1.25rem 1.5rem", overflowX: "auto", borderBottom: "1px solid #1a1a1a", background: "#0f0f0f" }}>
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenQuestion(null); }}
                style={{
                  padding: "0.55rem 1.1rem",
                  borderRadius: "50px",
                  border: active ? `1.5px solid ${cat.color}` : "1.5px solid #2a2a2a",
                  background: active ? `${cat.color}18` : "transparent",
                  color: active ? cat.color : "#666",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                {cat.icon} {cat.label}
                <span style={{ marginRight: "0.4rem", fontSize: "0.75rem", opacity: 0.7 }}>({cat.questions.length})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Questions List */}
      <div style={{ padding: "1.5rem", maxWidth: "860px", margin: "0 auto" }}>
        {search && (
          <div style={{ color: "#555", fontSize: "0.85rem", marginBottom: "1rem" }}>
            نتائج البحث: {filtered.length} سؤال
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#444", padding: "3rem" }}>لا توجد نتائج</div>
        )}

        {filtered.map((item, i) => {
          const isOpen = openQuestion === i;
          return (
            <div
              key={i}
              style={{
                marginBottom: "0.75rem",
                border: `1px solid ${isOpen ? item.catColor + "44" : "#1e1e1e"}`,
                borderRadius: "12px",
                overflow: "hidden",
                background: isOpen ? "#141414" : "#111",
                transition: "all 0.25s",
              }}
            >
              <button
                onClick={() => setOpenQuestion(isOpen ? null : i)}
                style={{
                  width: "100%",
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "right",
                  color: "#e8e8e8",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: item.catColor, fontSize: "1.1rem", flexShrink: 0 }}>
                  {isOpen ? "▾" : "▸"}
                </span>
                <span style={{ flex: 1, lineHeight: 1.5 }}>{item.q}</span>
                {search && (
                  <span style={{ fontSize: "0.7rem", color: item.catColor, border: `1px solid ${item.catColor}44`, padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>
                    {item.catLabel}
                  </span>
                )}
              </button>

              {isOpen && (
                <div style={{ padding: "0 1.25rem 1.25rem 1.25rem" }}>
                  <div style={{ height: "1px", background: `${item.catColor}22`, marginBottom: "1rem" }} />
                  <pre style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: "0.92rem",
                    lineHeight: 1.8,
                    color: "#c8c8c8",
                  }}>
                    {item.a}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "2rem", color: "#333", fontSize: "0.8rem", borderTop: "1px solid #1a1a1a" }}>
        {totalQ} سؤال • Laravel · Node.js · React · React Native · Backend · System Design · Testing
      </div>
    </div>
  );
}
