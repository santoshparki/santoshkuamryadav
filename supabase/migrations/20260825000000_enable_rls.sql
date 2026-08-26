-- Enable a deny-by-default security model for all portfolio data.
-- Prisma uses the server-side database connection; browser/anonymous access is
-- controlled by the policies below.

create or replace function public.is_portfolio_editor()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.users
    where email = coalesce(auth.jwt() ->> 'email', '')
      and role in ('ADMIN'::public."UserRole", 'EDITOR'::public."UserRole")
  );
$$;

revoke all on function public.is_portfolio_editor() from public;
grant execute on function public.is_portfolio_editor() to authenticated;

alter table public.users enable row level security;
alter table public.about enable row level security;
alter table public.about_tags enable row level security;
alter table public.hero enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.certificates enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blogs enable row level security;
alter table public.testimonials enable row level security;
alter table public.services enable row level security;
alter table public.contact_messages enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.media enable row level security;

-- Public portfolio reads. The public application only reads published projects.
create policy "public reads hero" on public.hero for select to anon, authenticated using (true);
create policy "public reads about" on public.about for select to anon, authenticated using (true);
create policy "public reads active about tags" on public.about_tags for select to anon, authenticated using ("isActive" = true);
create policy "public reads skill categories" on public.skill_categories for select to anon, authenticated using (true);
create policy "public reads skills" on public.skills for select to anon, authenticated using (true);
create policy "public reads published projects" on public.projects for select to anon, authenticated using (status = 'PUBLISHED'::public."ProjectStatus");
create policy "public reads images of published projects" on public.project_images for select to anon, authenticated using (
  exists (
    select 1 from public.projects
    where projects.id = project_images."projectId"
      and projects.status = 'PUBLISHED'::public."ProjectStatus"
  )
);
create policy "public reads experiences" on public.experiences for select to anon, authenticated using (true);
create policy "public reads education" on public.education for select to anon, authenticated using (true);
create policy "public reads certificates" on public.certificates for select to anon, authenticated using (true);
create policy "public reads services" on public.services for select to anon, authenticated using (true);
create policy "public reads social links" on public.social_links for select to anon, authenticated using (true);
create policy "public reads site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "public reads homepage sections" on public.homepage_sections for select to anon, authenticated using (true);
create policy "public reads blog categories" on public.blog_categories for select to anon, authenticated using (true);
create policy "public reads published blogs" on public.blogs for select to anon, authenticated using (status = 'PUBLISHED'::public."BlogStatus");
create policy "public reads testimonials" on public.testimonials for select to anon, authenticated using (true);

-- Authenticated portfolio editors may manage CMS records. No policy grants them
-- access to users, contact messages, or media metadata.
create policy "editors manage about" on public.about for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage about tags" on public.about_tags for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage hero" on public.hero for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage skill categories" on public.skill_categories for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage skills" on public.skills for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage projects" on public.projects for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage project images" on public.project_images for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage experiences" on public.experiences for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage education" on public.education for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage certificates" on public.certificates for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage blog categories" on public.blog_categories for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage blogs" on public.blogs for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage testimonials" on public.testimonials for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage services" on public.services for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage social links" on public.social_links for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage site settings" on public.site_settings for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());
create policy "editors manage homepage sections" on public.homepage_sections for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());

-- Contact messages are created by the server-side API and are visible only to
-- editors through the CMS. Anonymous clients receive no direct table access.
create policy "editors manage contact messages" on public.contact_messages for all to authenticated using (public.is_portfolio_editor()) with check (public.is_portfolio_editor());

-- Restrict portfolio storage. The bucket may remain public for image delivery,
-- but browser writes require an editor session.
create policy "public reads portfolio assets" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-assets');
create policy "editors upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and public.is_portfolio_editor());
create policy "editors update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and public.is_portfolio_editor()) with check (bucket_id = 'portfolio-assets' and public.is_portfolio_editor());
create policy "editors delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and public.is_portfolio_editor());
